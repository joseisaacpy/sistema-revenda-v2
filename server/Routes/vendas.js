// IMPORTS
import express from "express";
import db from "../Database/connection.js"; // Seu pool de conexão com o PostgreSQL
import { verificarToken } from "../middlewares/authMiddleware.js";
import prisma from "../Lib/prisma.js";
import PDFDocument from "pdfkit";

// CONSTANTES
const router = express.Router();

// CREATE - Registrar uma nova venda
router.post("/", verificarToken, async (req, res) => {
  // Desestruturar os dados do corpo da requisição
  const {
    id_veiculo,
    id_cliente,
    data_venda, // Virá do frontend em formato string 'YYYY-MM-DD'
    valor_venda,
    forma_pagamento,
    observacoes,
  } = req.body;

  // --- 1. Validação Básica dos Dados Recebidos ---
  // Verifica se todos os campos obrigatórios estão presentes
  if (!id_veiculo || !id_cliente || !valor_venda || !forma_pagamento) {
    return res.status(400).json({
      error:
        "Todos os campos obrigatórios (id_veiculo, id_cliente, valor_venda, forma_pagamento) devem ser preenchidos.",
    });
  }

  // Validação de tipos (opcional, mas recomendado para segurança extra)
  if (
    typeof id_veiculo !== "number" ||
    typeof id_cliente !== "number" ||
    isNaN(valor_venda)
  ) {
    return res.status(400).json({
      error: "id_veiculo, id_cliente e valor_venda devem ser números válidos.",
    });
  }

  // Valida se o valor de venda é positivo
  if (parseFloat(valor_venda) <= 0) {
    return res
      .status(400)
      .json({ error: "O valor da venda deve ser um número positivo." });
  }

  // Inicia uma transação de banco de dados
  const client = await db.connect(); // Obtém um cliente do pool de conexões
  try {
    await client.query("BEGIN"); // Inicia a transação

    // --- 2. Verificar a Disponibilidade do Veículo ---
    // Consulta o veículo e o bloqueia para evitar que outro processo o venda simultaneamente
    const veiculoResult = await client.query(
      "SELECT status FROM veiculos WHERE id = $1 FOR UPDATE",
      [id_veiculo]
    );

    // Se o veículo não existe
    if (veiculoResult.rows.length === 0) {
      await client.query("ROLLBACK"); // Reverte a transação
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    // Se o veículo já foi vendido
    if (veiculoResult.rows[0].status === "vendido") {
      await client.query("ROLLBACK"); // Reverte a transação
      return res
        .status(409)
        .json({ error: "Este veículo já foi vendido e não está disponível." }); // 409 Conflict
    }

    // --- 3. Verificar se o Cliente Existe ---
    // Embora o FOREIGN KEY ajude, uma verificação explícita antes pode dar uma mensagem melhor
    const clienteResult = await client.query(
      "SELECT id FROM clientes WHERE id = $1",
      [id_cliente]
    );

    if (clienteResult.rows.length === 0) {
      await client.query("ROLLBACK"); // Reverte a transação
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // --- 4. Registrar a Venda na Tabela 'vendas' ---
    const insertVendaQuery = `
      INSERT INTO vendas (id_veiculo, id_cliente, data_venda, valor_venda, forma_pagamento, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; -- Retorna a linha inserida
    `;
    const vendaResult = await client.query(insertVendaQuery, [
      id_veiculo,
      id_cliente,
      data_venda || new Date().toISOString().slice(0, 10), // Usa a data da requisição ou a data atual como fallback
      parseFloat(valor_venda),
      forma_pagamento,
      observacoes,
    ]);

    // --- 5. Atualizar o Status do Veículo para 'vendido' ---
    const updateVeiculoQuery = `
      UPDATE veiculos
      SET status = 'vendido'
      WHERE id = $1;
    `;
    await client.query(updateVeiculoQuery, [id_veiculo]);

    // --- 6. Confirmar a Transação ---
    await client.query("COMMIT"); // Confirma todas as operações

    // Resposta de sucesso
    res.status(201).json({
      message: "Venda registrada com sucesso!",
      venda: vendaResult.rows[0], // Retorna os dados da venda recém-criada
    });
  } catch (error) {
    // Em caso de qualquer erro, reverte a transação
    await client.query("ROLLBACK");
    console.error("Erro ao registrar venda:", error);
    // Retorna um erro genérico 500 para o cliente, logando o erro detalhado no servidor
    res.status(500).json({
      error:
        "Erro interno do servidor ao registrar a venda. Por favor, tente novamente.",
    });
  } finally {
    // Libera o cliente de volta para o pool de conexões
    client.release();
  }
});

// READ - Obter todas as vendas com detalhes de cliente e veículo
router.get("/", verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT
          v.id,
          v.data_venda,
          v.valor_venda,
          v.forma_pagamento,
          v.observacoes,
          c.nome AS cliente_nome,
          c.cpf_cnpj AS cliente_cpf_cnpj,
          ve.marca AS veiculo_marca,
          ve.modelo AS veiculo_modelo,
          ve.placa AS veiculo_placa,
          ve.ano_modelo AS veiculo_ano_modelo,
          ve.cor AS veiculo_cor
      FROM
          vendas v
      JOIN
          clientes c ON v.id_cliente = c.id
      JOIN
          veiculos ve ON v.id_veiculo = ve.id
      ORDER BY
          v.data_venda DESC, v.id DESC; -- Ordena pela data mais recente e depois pelo ID para consistência
    `;

    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma venda encontrada." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar as vendas:", error); // Adicionei o ":" para consistência
    // Retorna um erro 500 para o cliente em caso de falha interna
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar as vendas." });
  }
});

// GET por ID
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const venda = await prisma.vendas.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!venda) {
      return res.status(404).json({ error: "Venda não encontrada." });
    }

    res.json(venda);
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    res.status(500).json({ error: "Erro ao buscar venda." });
  }
});

//
router.get("/:id/recibo", verificarToken, async (req, res) => {
  try {
    const venda = await prisma.vendas.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        clientes: true,
        veiculos: true,
      },
    });

    if (!venda) {
      return res.status(404).json({ error: "Venda não encontrada." });
    }
    // Configuração do PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=recibo-venda-${venda.id}.pdf`
    );
    doc.pipe(res);

    // Dados para o recibo
    const dataFormatada = new Date(venda.data_venda).toLocaleDateString(
      "pt-BR"
    );
    const valorFormatado = Number(venda.valor_venda).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    // Imagem logo do recibo ou título com nome da empresa
    doc.fontSize(35).text("SÓ CAMIONETES", { align: "center",  });
    doc.fontSize(25).text("(86)99986-7265", { align: "right" });

    // Imagem no topo como header
    // doc.image("../server/images/carro.jpeg", {
    //   fit: [500, 200], // Largura e altura da imagem
    //   align: "center", // Centralizada
    //   valign: "top", // No topo
    //   x: doc.page.margins.left, // Início respeitando margem esquerda
    //   y: 30, // Distância do topo da página
    // });

    // Espaço após a imagem
    doc.moveDown(3); // Adiciona várias linhas em branco (~5 linhas de espaçamento)

    // Cabecalho
    doc.fontSize(18).text("CONTRATO DE VENDA", { align: "left" });
    doc.fontSize(18).text(`${valorFormatado}`, { align: "right" });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Eu, ${venda.clientes.nome}, inscrito sob o CPF/CNPJ ${venda.clientes.cpf_cnpj},`
      );
    doc.text(
      `declaro que adquiri o veículo ${venda.veiculos.modelo} / ${venda.veiculos.marca},`
    );
    doc.text(
      `placa ${venda.veiculos.placa}, ano/modelo ${venda.veiculos.ano_modelo}, cor ${venda.veiculos.cor},`
    );
    doc.text(`no valor de R$ ${parseFloat(venda.valor_venda).toFixed(2)},`);
    doc.text(`pago via ${venda.forma_pagamento}, na data de ${dataFormatada}.`);
    doc.moveDown();
    doc.text(`Observações: ${venda.observacoes || "Nenhuma"}`);
    doc.moveDown().moveDown();

    doc.text("Assinatura do Vendedor: __________________________", {
      align: "left",
    });
    doc.text("Assinatura do Comprador: _________________________", {
      align: "left",
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar o recibo:", error);
    res.status(500).json({ error: "Erro ao gerar o recibo." });
  }
});

export default router;
