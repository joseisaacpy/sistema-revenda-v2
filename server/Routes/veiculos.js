// IMPORTS
import express from "express";
import db from "../Database/connection.js";

// CONSTANTES
const router = express.Router();

// CREATE (único Carro)
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
      `INSERT INTO carros 
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
    res.status(201).json({ message: "Carro cadastrado com sucesso." });
  } catch (error) {
    console.error("Erro ao cadastrar carro:", error);
    res.status(500).json({ error: "Erro ao cadastrar carro." });
  }
});

// READ (todos)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM carros");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhum Carro encontrado." });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar Carros:", error);
    res.status(500).json({ error: "Erro ao buscar Carros." });
  }
});

// READ (por ID)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM carros WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Carro não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Carro:", error);
    res.status(500).json({ error: "Erro ao buscar Carro." });
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
      `UPDATE carros 
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
      return res.status(404).json({ error: "Carro não encontrado." });
    }

    res.json({ message: "Carro atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar Carro:", error);
    res.status(500).json({ error: "Erro ao atualizar Carro." });
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
      return res.status(404).json({ error: "Carro não encontrado." });
    }

    res.json({ message: "Carro deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar Carro:", error);
    res.status(500).json({ error: "Erro ao deletar Carro." });
  }
});

export default router;
