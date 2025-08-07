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

    // Cria o PDF
    const doc = new PDFDocument({ margin: 50 });
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

    // Cabeçalho com nome da empresa e telefone
    doc.fontSize(35).text("SÓ CAMIONETES", { align: "center" });
    doc.fontSize(14).text("CNPJ: 25.286.227/0001-76", { align: "center" });
    doc
      .fontSize(14)
      .text("Av. Barão de Gurguéia, 1180 - Vermelha - Teresina/PI", {
        align: "center",
      });
    doc.fontSize(14).text("Telefone: (86) 99986-7265", { align: "center" });
    doc.moveDown(2);

    // Título do documento
    doc.fontSize(20).text("RECIBO DE VENDA DE VEÍCULO", { align: "center" });
    doc.moveDown(2);
    // Dados do vendedor
    doc
      .fontSize(12)
      .text(
        `VENDEDOR: SÓ CAMIONETES LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 25.286.227/0001-76, com sede em Teresina/PI, na Avenida Barão de Gurguéia, nº 1180, bairro Vermelha.`
      );

    doc.moveDown();

    // Dados do comprador
    doc.text(
      `COMPRADOR: ${venda.clientes.nome}, inscrito no CPF/CNPJ sob o nº ${venda.clientes.cpf_cnpj}, residente em ${venda.clientes.endereco}, telefone ${venda.clientes.telefone}.`
    );

    doc.moveDown();

    // Objeto
    doc.fontSize(12).text("OBJETO:", { underline: true });
    doc.text(`Marca: ${venda.veiculos.marca}`);
    doc.text(`Modelo: ${venda.veiculos.modelo}`);
    doc.text(`Ano Fab/Mod: ${venda.veiculos.ano_modelo}`);
    doc.text(`Placa: ${venda.veiculos.placa}`);
    doc.text(`Chassi: ${venda.veiculos.chassi}`);
    doc.text(`Cor: ${venda.veiculos.cor}`);
    doc.text(`Km: ${venda.veiculos.km}`);
    doc.text(`Renavam: ${venda.veiculos.renavam}`);
    doc.text(
      `Data da venda: ${new Date(venda.data_venda).toLocaleDateString("pt-BR")}`
    );
    doc.moveDown();

    // Forma de pagamento
    doc.fontSize(12).text("FORMA DE PAGAMENTO:", { underline: true });
    doc.text(`${venda.forma_pagamento}`);
    doc.moveDown();

    // Documentação
    doc.fontSize(12).text("DOCUMENTAÇÃO:", { underline: true });
    doc.text(`Dados da transferência: Aberto cliente`);
    doc.moveDown();

    // Observações
    doc.fontSize(12).text("OBSERVAÇÕES:", { underline: true });
    doc.text(`${venda.observacoes || "Nenhuma"}`);
    doc.moveDown();

    // Cláusulas
    doc
      .fontSize(12)
      .text("CLÁUSULA PRIMEIRA – DA VISTORIA E AVALIAÇÃO DO VEÍCULO:", {
        underline: true,
      });
    doc.text(
      `O comprador declara ter vistoriado o veículo e concorda com seu estado de conservação no momento da compra.`
    );

    doc.moveDown();

    doc
      .fontSize(12)
      .text("CLÁUSULA SEGUNDA – DA RESPONSABILIDADE CIVIL E CRIMINAL:", {
        underline: true,
      });
    doc.text(
      `A partir da presente data, todas as responsabilidades civis e criminais relacionadas ao veículo passam a ser do comprador.`
    );

    doc.moveDown(2);

    // Local e data
    doc.text(`Teresina/PI, ${new Date().toLocaleDateString("pt-BR")}`, {
      align: "right",
    });
    doc.moveDown(2);

    // Assinaturas
    doc.text(
      "Assinatura do Vendedor: ____________________________________________________"
    );
    doc.moveDown();
    doc.text(
      "Assinatura do Comprador: __________________________________________________"
    );

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar o recibo:", error);
    res.status(500).json({ error: "Erro ao gerar o recibo." });
  }
});

export default router;
