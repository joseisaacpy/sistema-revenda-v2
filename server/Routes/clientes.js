// IMPORTS
import express from "express";
import db from "../Database/connection.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import prisma from "../Lib/prisma.js";

// CONSTANTES
const router = express.Router();

// Create
router.post("/", verificarToken, async (req, res) => {
  const {
    cpf_cnpj,
    pessoa,
    sexo,
    nome,
    telefone_celular,
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
  } = req.body;

  if (!nome || !cpf_cnpj || !telefone_celular) {
    return res.status(400).json({
      error: "Nome, CPF/CNPJ e Telefone são obrigatórios.",
    });
  }

  // Função para limpar strings vazias e nulas
  const sanitize = (value) =>
    typeof value === "string" && value.trim() !== "" ? value.trim() : null;

  try {
    const novoCliente = await prisma.clientes.create({
      data: {
        cpf_cnpj: sanitize(cpf_cnpj),
        pessoa: sanitize(pessoa),
        sexo: sanitize(sexo),
        nome: sanitize(nome), // nome é obrigatório, mas ainda sanitize
        telefone_celular: sanitize(telefone_celular),
        telefone_comercial: sanitize(telefone_comercial),
        rg: sanitize(rg),
        ie: sanitize(ie),
        data_nascimento: sanitize(data_nascimento) || null,
        data_cadastro: sanitize(data_cadastro) || new Date().toISOString(),
        email: sanitize(email),
        cep: sanitize(cep),
        rua: sanitize(rua),
        numero: sanitize(numero),
        bairro: sanitize(bairro),
        estado: sanitize(estado),
        cidade: sanitize(cidade),
        complemento: sanitize(complemento),
      },
    });

    res.status(201).json({ message: "Cliente criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar o cliente:", error.message);
    res.status(500).json({ error: "Erro ao criar o cliente." });
  }
});

// Read todos
router.get("/", verificarToken, async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany();
    if (!clientes) {
      return res.status(404).json({ error: "Nenhum cliente encontrado." });
    }
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar os clientes", error);
    res.status(500).json({ error: "Erro ao buscar os clientes." });
  }
});

// Read por ID
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const cliente = await prisma.clientes.findUnique({
      where: { id: Number(req.params.id) },
    });
    // Validação de cliente
    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.json(cliente);
    // Validação de cliente
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
      `UPDATE clientes 
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
    const result = await prisma.clientes.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    // Validação de cliente
    if (!result) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.json({ message: "Cliente deletado com sucesso." });
    // Validação de cliente
    const cliente = await prisma.clientes.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!cliente) {
      return res.status(404).json({
        error: "Cliente nao encontrado.",
      });
    }
  } catch (error) {
    console.error("Erro ao deletar o cliente", error);
    res.status(500).json({ error: "Erro ao deletar o cliente." });
  }
});

export default router;
