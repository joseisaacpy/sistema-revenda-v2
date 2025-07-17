// IMPORTS
import express from "express";
import db from "../Database/connection.js";

// CONSTANTES
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const {
    chassi,
    placa,
    marca,
    modelo,
    ano_modelo,
    cor,
    combustivel,
    km,
    valor_compra,
    valor_venda_sugerido,
    status_estoque,
    data_compra,
  } = req.body;

  // Validação simples
  if (
    !chassi ||
    !placa ||
    !marca ||
    !modelo ||
    !ano_modelo ||
    !cor ||
    !combustivel ||
    !km ||
    !valor_compra ||
    !valor_venda_sugerido ||
    !status_estoque ||
    !data_compra
  ) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios.",
    });
  }

  try {
    await db.query(
      `INSERT INTO veiculos_estoque 
      (chassi, placa, marca, modelo, ano_modelo, cor, combustivel, km, valor_compra, valor_venda_sugerido, status_estoque, data_compra) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        chassi,
        placa,
        marca,
        modelo,
        ano_modelo,
        cor,
        combustivel,
        km,
        valor_compra,
        valor_venda_sugerido,
        status_estoque,
        data_compra,
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
    const result = await db.query("SELECT * FROM veiculos_estoque");
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
    const result = await db.query("SELECT * FROM veiculos_estoque WHERE id = $1", [id]);
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
    placa,
    marca,
    modelo,
    ano_modelo,
    cor,
    combustivel,
    km,
    valor_compra,
    valor_venda_sugerido,
    status_estoque,
    data_compra,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE veiculos_estoque 
      SET chassi = $1, placa = $2, marca = $3, modelo = $4, ano_modelo = $5, cor = $6, combustivel = $7, km = $8, valor_compra = $9, valor_venda_sugerido = $10, status_estoque = $11, data_compra = $12
      WHERE id = $13`,
      [
        chassi,
        placa,
        marca,
        modelo,
        ano_modelo,
        cor,
        combustivel,
        km,
        valor_compra,
        valor_venda_sugerido,
        status_estoque,
        data_compra,
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
    const result = await db.query("DELETE FROM carros WHERE id_carro = $1", [
      id,
    ]);

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
