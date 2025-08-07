// IMPORTS
import express from "express";
import { verificarToken } from "../Middlewares/authMiddleware.js";
import prisma from "../Lib/prisma.js";

// CONSTANTES
const router = express.Router();

// CREATE - Cadastrar um novo veículo
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

  // Validação mais detalhada para cada campo obrigatório
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
    const insertQuery = `
      INSERT INTO veiculos (
        chassi, renavam, placa, marca, modelo, ano_modelo, combustivel, cor, km,
        valor_compra, data_compra, fornecedor, cpf_cnpj_fornecedor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
      `;

    const result = await db.query(insertQuery, [
      chassi,
      renavam,
      placa,
      marca,
      modelo,
      parseInt(ano_modelo), // Conversão para INT
      combustivel,
      cor,
      parseInt(km), // Conversão para INT
      parseFloat(valor_compra), // Conversão para NUMERIC
      data_compra, // Assume que a data está em formato YYYY-MM-DD
      fornecedor,
      cpf_cnpj_fornecedor,
    ]);

    res.status(201).json({
      message: "Veículo cadastrado com sucesso.",
      veiculo: result.rows[0], // Retorna o objeto do veículo cadastrado
    });
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    // Tratamento de erro para UNIQUE constraint violation (duplicidade de chassi, renavam, placa)
    if (error.code === "23505") {
      // Este é o código de erro para unique_violation no PostgreSQL
      let field = "campo desconhecido";
      if (error.constraint.includes("chassi")) field = "Chassi";
      else if (error.constraint.includes("renavam")) field = "Renavam";
      else if (error.constraint.includes("placa")) field = "Placa";
      return res
        .status(409)
        .json({ error: `Já existe um veículo com este ${field}.` });
    }
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao cadastrar veículo." });
  }
});

// READ (por status)
router.get("/", verificarToken, async (req, res) => {
  try {
    const status = req.query.status?.trim().toLowerCase(); // Pega o status do query parameter
    let queryText = "SELECT * FROM veiculos"; // Consulta base
    const queryParams = []; // Array para parâmetros da consulta

    // Se um status válido for fornecido, adiciona a cláusula WHERE
    if (status === "estoque" || status === "vendido") {
      queryText += " WHERE status = $1";
      queryParams.push(status);
    } else if (status) {
      // Se um status foi fornecido, mas é inválido
      return res
        .status(400)
        .json({ error: "Status inválido. Use 'estoque' ou 'vendido'." });
    }

    const result = await db.query(queryText, queryParams);

    if (result.rows.length === 0 && queryParams.length > 0) {
      // Se filtrou e não encontrou nada
      return res
        .status(404)
        .json({ error: `Nenhum veículo encontrado com status '${status}'.` });
    } else if (result.rows.length === 0) {
      // Se não filtrou e não tem veículos no total
      return res.status(404).json({ error: "Nenhum veículo cadastrado." });
    }

    return res.json(result.rows);
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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
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

  try {
    const result = await db.query(
      `UPDATE veiculos 
      SET chassi = $1, renavam = $2, placa = $3, marca = $4, modelo = $5, ano_modelo = $6, combustivel = $7, cor = $8, km = $9, valor_compra = $10, data_compra = $11, fornecedor = $12, cpf_cnpj_fornecedor = $13
      WHERE id = $14`,
      [
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
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

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
