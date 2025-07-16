// IMPORTS
import express from "express";
import db from "../Database/connection.js";

// CONSTANTES
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const {
    cod_cliente,
    cod_reve,
    cpf_cnpj,
    pessoa,
    sexo,
    nome,
    telefone_celular,
    telefone_residencial,
    telefone_comercial,
    rg,
    ie,
    data_nascimento,
    data_cadastro,
    email,
    cep,
    rua,
    numero,
    bairro,
    estado,
    cidade,
    complemento,
    cargo,
    nome_mae,
    nome_pai,
    data_ultima_compra,
    quantidade_veic_comprados,
  } = req.body;

  if (!nome || !cpf_cnpj || !telefone_celular) {
    return res.status(400).json({
      error: "Nome, CPF/CNPJ e Telefone são obrigatórios.",
    });
  }

  try {
    await db.query(
      `INSERT INTO clientes_nova
      (cod_cliente,cod_reve,cpf_cnpj,pessoa,sexo,nome,telefone_celular,telefone_residencial,telefone_comercial,rg,ie,data_nascimento,data_cadastro,email,cep,rua,numero,bairro,estado,cidade,complemento,cargo,nome_mae,nome_pai,data_ultima_compra,quantidade_veic_comprados,)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,

      [
        cod_cliente || null,
        cod_reve || null,
        cpf_cnpj,
        pessoa || null,
        sexo || null,
        nome,
        telefone_celular,
        telefone_residencial || null,
        telefone_comercial || null,
        rg || null,
        ie || null,
        data_nascimento || null,
        data_cadastro || new Date(),
        email || null,
        cep || null,
        rua || null,
        numero || null,
        bairro || null,
        estado || null,
        cidade || null,
        complemento || null,
        cargo || null,
        nome_mae || null,
        nome_pai || null,
        data_ultima_compra || null,
        quantidade_veic_comprados || 0,
      ]
    );
    res.status(201).json({ message: "Cliente criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar o cliente:", error.message);
    res.status(500).json({ error: "Erro ao criar o cliente." });
  }
});

// Read todos
router.get("/", async (req, res) => {
  try {
    const clientes = await db.query("SELECT * FROM clientes_nova");
    res.json(clientes.rows);
  } catch (error) {
    console.error("Erro ao buscar os clientes", error);
    res.status(500).json({ error: "Erro ao buscar os clientes." });
  }
});

// Read por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await db.query("SELECT * FROM clientes_nova WHERE id=$1", [
      id,
    ]);
    // Validação de cliente
    if (cliente.rows.length === 0) {
      return res.status(404).json({ error: "Cliente nao encontrado." });
    }
    res.json(cliente.rows[0]); // Retorna apenas o cliente encontrado
  } catch (error) {
    console.error("Erro ao buscar o cliente", error);
    res.status(500).json({ error: "Erro ao buscar o cliente." });
  }
});

// Update
// Update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      cpf_cnpj,
      dataNascimento,
      email,
      telefone,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    } = req.body;

    const result = await db.query(
      `UPDATE clientes_nova 
       SET nome=$1, cpf_cnpj=$2, dataNascimento=$3, email=$4, telefone_celular=$5,
           cep=$6, rua=$7, numero=$8, bairro=$9, cidade=$10, estado=$11
       WHERE id=$12`,
      [
        nome,
        cpf_cnpj,
        dataNascimento || null,
        email || null,
        telefone,
        cep || null,
        rua || null,
        numero || null,
        bairro || null,
        cidade || null,
        estado || null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    res.json({ message: "Cliente atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o cliente", error);
    res.status(500).json({ error: "Erro ao atualizar o cliente." });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM clientes_nova WHERE id_cliente = $1",
      [id]
    );
    res.json({ message: "Cliente deletado com sucesso." });
    // Valida se o cliente foi deletado
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao deletar o cliente", error);
    res.status(500).json({ error: "Erro ao deletar o cliente." });
  }
});

export default router;
