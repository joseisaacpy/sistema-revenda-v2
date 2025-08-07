// IMPORTS
import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import prisma from "../Lib/prisma.js";

// CONSTANTES
const router = express.Router();

// CREATE
router.post("/", verificarToken, async (req, res) => {
  const {
    chassi,
    renavam,
    placa,
    marca,
    modelo,
    ano_modelo,
    combustivel,
    cor,
    km,
    valor_compra,
    data_compra,
    fornecedor,
    cpf_cnpj_fornecedor,
  } = req.body;

  // Validação detalhada
  if (!chassi) return res.status(400).json({ error: "Chassi é obrigatório." });
  if (!renavam)
    return res.status(400).json({ error: "Renavam é obrigatório." });
  if (!placa) return res.status(400).json({ error: "Placa é obrigatória." });
  if (!marca) return res.status(400).json({ error: "Marca é obrigatória." });
  if (!modelo) return res.status(400).json({ error: "Modelo é obrigatório." });
  if (!ano_modelo)
    return res.status(400).json({ error: "Ano Modelo é obrigatório." });
  if (isNaN(parseInt(ano_modelo)))
    return res
      .status(400)
      .json({ error: "Ano Modelo deve ser um número válido." });
  if (!combustivel)
    return res.status(400).json({ error: "Combustível é obrigatório." });
  if (!cor) return res.status(400).json({ error: "Cor é obrigatória." });
  if (!km) return res.status(400).json({ error: "KM é obrigatório." });
  if (isNaN(parseFloat(km)) || parseFloat(km) < 0)
    return res
      .status(400)
      .json({ error: "KM deve ser um número não negativo." });
  if (!valor_compra)
    return res.status(400).json({ error: "Valor de Compra é obrigatório." });
  if (isNaN(parseFloat(valor_compra)) || parseFloat(valor_compra) <= 0)
    return res
      .status(400)
      .json({ error: "Valor de Compra deve ser um número positivo." });
  if (!data_compra)
    return res.status(400).json({ error: "Data de Compra é obrigatória." });
  if (!fornecedor)
    return res.status(400).json({ error: "Fornecedor é obrigatório." });
  if (!cpf_cnpj_fornecedor)
    return res
      .status(400)
      .json({ error: "CPF/CNPJ do Fornecedor é obrigatório." });

  try {
    const veiculo = await prisma.veiculos.create({
      data: {
        chassi,
        renavam,
        placa,
        marca,
        modelo,
        ano_modelo: parseInt(ano_modelo),
        combustivel,
        cor,
        km: parseInt(km),
        valor_compra: parseFloat(valor_compra),
        data_compra: new Date(data_compra), // converte string para Date
        fornecedor,
        cpf_cnpj_fornecedor,
      },
    });

    return res.status(201).json({
      message: "Veículo cadastrado com sucesso.",
      veiculo,
    });
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);

    // Tratamento para unique constraint, adaptado para Prisma
    if (error.code === "P2002") {
      // P2002 é o erro do Prisma para violação de unique constraint
      const field = error.meta?.target?.[0] || "campo desconhecido";
      return res.status(409).json({
        error: `Já existe um veículo com este ${field}.`,
      });
    }

    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao cadastrar veículo." });
  }
});

// READ por Status
router.get("/", verificarToken, async (req, res) => {
  try {
    const status = req.query.status?.trim().toLowerCase();

    // Validação de status (caso fornecido)
    if (status && status !== "estoque" && status !== "vendido") {
      return res
        .status(400)
        .json({ error: "Status inválido. Use 'estoque' ou 'vendido'." });
    }

    // Monta o filtro condicionalmente
    const filtro = status ? { status } : {};

    const veiculos = await prisma.veiculos.findMany({
      where: filtro,
    });

    if (veiculos.length === 0) {
      const mensagem = status
        ? `Nenhum veículo encontrado com status '${status}'.`
        : "Nenhum veículo cadastrado.";
      return res.status(404).json({ error: mensagem });
    }

    return res.json(veiculos);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar veículos." });
  }
});

// READ (por ID)
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const veiculo = await prisma.veiculos.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    // Validação de cliente
    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }
    res.json(veiculo);
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    res.status(500).json({ error: "Erro ao buscar veículo." });
  }
});

// UPDATE
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const veiculo = await prisma.veiculos.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    // Validação de veiculo
    if (!veiculo) {
      return res.status(404).json({ error: "Veiculo não encontrado." });
    }
    const {
      chassi,
      renavam,
      placa,
      marca,
      modelo,
      ano_modelo,
      combustivel,
      cor,
      km,
      valor_compra,
      data_compra,
      fornecedor,
      cpf_cnpj_fornecedor,
    } = req.body;

    await prisma.veiculos.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        chassi,
        renavam,
        placa,
        marca,
        modelo,
        ano_modelo: parseInt(ano_modelo),
        combustivel,
        cor,
        km: parseInt(km),
        valor_compra: parseFloat(valor_compra),
        data_compra: new Date(data_compra), // converte string para Date
        fornecedor,
        cpf_cnpj_fornecedor,
      },
    });

    res.json({ message: "Veículo atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
    res.status(500).json({ error: "Erro ao atualizar veículo." });
  }
});

// DELETE
router.delete("/:id", verificarToken, async (req, res) => {
  const id = Number(req.params.id);

  // Verifica se o ID é válido
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    // Verifica se o veículo existe antes de deletar
    const veiculo = await prisma.veiculos.findUnique({
      where: { id },
    });

    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    // Deleta o veículo
    await prisma.veiculos.delete({
      where: { id },
    });

    res.json({ message: "Veículo deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    res.status(500).json({ error: "Erro ao deletar veículo." });
  }
});
export default router;
