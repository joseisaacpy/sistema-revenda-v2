// IMPORTS
import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import prisma from "../Lib/prisma.js";
import PDFDocument from "pdfkit";

// CONSTANTES
const router = express.Router();

// CREATE - Registrar uma nova venda
router.post("/", verificarToken, async (req, res) => {
  const {
    id_veiculo,
    id_cliente,
    data_venda,
    valor_venda,
    forma_pagamento,
    observacoes,
  } = req.body;

  // Validação básica
  if (!id_veiculo || !id_cliente || !valor_venda || !forma_pagamento) {
    return res.status(400).json({
      error:
        "Todos os campos obrigatórios (id_veiculo, id_cliente, valor_venda, forma_pagamento) devem ser preenchidos.",
    });
  }

  if (
    typeof id_veiculo !== "number" ||
    typeof id_cliente !== "number" ||
    isNaN(valor_venda)
  ) {
    return res.status(400).json({
      error: "id_veiculo, id_cliente e valor_venda devem ser números válidos.",
    });
  }

  if (parseFloat(valor_venda) <= 0) {
    return res.status(400).json({
      error: "O valor da venda deve ser um número positivo.",
    });
  }

  try {
    const novaVenda = await prisma.$transaction(async (tx) => {
      // Verifica se o veículo existe
      const veiculo = await tx.veiculos.findUnique({
        where: { id: id_veiculo },
      });

      if (!veiculo) {
        throw new Error("Veículo não encontrado.");
      }

      if (veiculo.status === "vendido") {
        throw new Error("Este veículo já foi vendido.");
      }

      // Verifica se o cliente existe
      const cliente = await tx.clientes.findUnique({
        where: { id: id_cliente },
      });

      if (!cliente) {
        throw new Error("Cliente não encontrado.");
      }

      // Cria a venda
      const vendaCriada = await tx.vendas.create({
        data: {
          id_veiculo,
          id_cliente,
          data_venda: data_venda ? new Date(data_venda) : new Date(),
          valor_venda: parseFloat(valor_venda),
          forma_pagamento,
          observacoes,
        },
      });

      // Atualiza status do veículo
      await tx.veiculos.update({
        where: { id: id_veiculo },
        data: { status: "vendido" },
      });

      return vendaCriada;
    });

    return res.status(201).json({
      message: "Venda registrada com sucesso!",
      venda: novaVenda,
    });
  } catch (error) {
    console.error("Erro ao registrar venda:", error.message);
    return res.status(500).json({
      error: error.message || "Erro ao registrar a venda.",
    });
  }
});

// READ - Obter todas as vendas com detalhes de cliente e veículo
router.get("/", verificarToken, async (req, res) => {
  try {
    const vendas = await prisma.vendas.findMany({
      orderBy: [{ data_venda: "desc" }, { id: "desc" }],
      include: {
        clientes: {
          select: {
            nome: true,
            cpf_cnpj: true,
          },
        },
        veiculos: {
          select: {
            marca: true,
            modelo: true,
            placa: true,
            ano_modelo: true,
            cor: true,
          },
        },
      },
    });

    // Verifica se há vendas
    if (vendas.length === 0) {
      return res.status(404).json({ error: "Nenhuma venda encontrada." });
    }
    // Cria um resultado formatado
    const resultadoFormatado = vendas.map((v) => ({
      id: v.id,
      data_venda: v.data_venda,
      valor_venda: v.valor_venda,
      forma_pagamento: v.forma_pagamento,
      observacoes: v.observacoes,
      cliente_nome: v.clientes.nome,
      cliente_cpf_cnpj: v.clientes.cpf_cnpj,
      veiculo_marca: v.veiculos.marca,
      veiculo_modelo: v.veiculos.modelo,
      veiculo_placa: v.veiculos.placa,
      veiculo_ano_modelo: v.veiculos.ano_modelo,
      veiculo_cor: v.veiculos.cor,
    }));

    res.json(resultadoFormatado);
  } catch (error) {
    console.error("Erro ao buscar as vendas:", error);
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

// GET Recibo
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
    doc.fontSize(35).text("SÓ CAMIONETES", { align: "center" });
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
