// IMPORTS
import express from "express";
import db from "../Database/connection.js";

// CONSTANTES
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const {
    chassi,
    renavan,
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

  // Validação simples
  if (
    !chassi ||
    !renavan ||
    !placa ||
    !marca ||
    !modelo ||
    !ano_modelo ||
    !combustivel ||
    !cor ||
    !km ||
    !valor_compra ||
    !data_compra ||
    !fornecedor ||
    !cpf_cnpj_fornecedor
  ) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios.",
    });
  }

  try {
    await db.query(
      `INSERT INTO veiculos 
      (chassi,renavan, placa, marca, modelo, ano_modelo, combustivel, cor, km, valor_compra, data_compra, fornecedor, cpf_cnpj_fornecedor) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        chassi,
        renavan,
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
      ]
    );
    res.status(201).json({ message: "Veículo cadastrado com sucesso." });
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    res.status(500).json({ error: "Erro ao cadastrar veículo." });
  }
});

// READ (todos)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM veiculos");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhum veículo encontrado." });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    res.status(500).json({ error: "Erro ao buscar veículos." });
  }
});

// READ (por ID)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM veiculos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }
    res.json(result.rows[0]);
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
    renavan,
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
      SET chassi = $1, renavan = $2, placa = $3, marca = $4, modelo = $5, ano_modelo = $6, combustivel = $7, cor = $8, km = $9, valor_compra = $10, data_compra = $11, fornecedor = $12, cpf_cnpj_fornecedor = $13
      WHERE id = $14`,
      [
        chassi,
        renavan,
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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM veiculos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    res.json({ message: "Veículo deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    res.status(500).json({ error: "Erro ao deletar veículo." });
  }
});

export default router;
