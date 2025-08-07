// IMPORTS
import express from "express";
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
    await prisma.clientes.create({
      data: {
        cpf_cnpj: sanitize(cpf_cnpj),
        pessoa: sanitize(pessoa),
        sexo: sanitize(sexo),
        nome: sanitize(nome),
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

// Teste Get All
router.get("/teste", async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany();
    if (clientes.length === 0) {
      return res.status(404).json({ error: "Nenhum cliente encontrado." });
    }
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar os clientes", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar os clientes.", datails: error.message });
  }
});

// Read todos
router.get("/", verificarToken, async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany();
    if (clientes.length === 0) {
      return res.status(404).json({ error: "Nenhum cliente encontrado." });
    }
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar os clientes", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar os clientes.", datails: error.message });
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
  } catch (error) {
    console.error("Erro ao buscar o cliente", error);
    res.status(500).json({ error: "Erro ao buscar o cliente." });
  }
});

// Update
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
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

    const clienteExistente = await prisma.clientes.findUnique({
      where: { id },
    });
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    await prisma.clientes.update({
      where: { id },
      data: {
        nome,
        cpf_cnpj,
        data_nascimento: dataNascimento || null,
        email,
        telefone_celular: telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      },
    });

    res.json({ message: "Cliente atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o cliente", error);
    res.status(500).json({ error: "Erro ao atualizar o cliente." });
  }
});

// Delete
router.delete("/:id", verificarToken, async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const cliente = await prisma.clientes.findUnique({ where: { id } });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    await prisma.clientes.delete({ where: { id } });

    res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar o cliente:", error);
    res.status(500).json({ error: "Erro ao deletar o cliente." });
  }
});

export default router;
