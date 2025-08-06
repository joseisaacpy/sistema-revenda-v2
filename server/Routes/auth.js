// IMPORTS
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Database/connection.js";
import prisma from "../Lib/prisma.js";

// CONSTANTES
const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

// ROTAS

// LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    // Valida se o usário foi encontrado
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ msg: "Senha incorreta." });
    }
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
      SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    // ✅ Retorna o token e opcionalmente os dados do usuário
    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro interno do servidor.", error: error.message });
  }
});

// REGISTRO
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Valida se os campos estão preenchidos
  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ msg: "Todos os campos devem ser preenchidos." });
  }

  // Valida se a senha tem pelo menos 6 caracteres
  if (senha.length < 6) {
    return res
      .status(400)
      .json({ msg: "A senha deve ter no mínimo 6 caracteres." });
  }

  try {
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { email },
    });

    // Verifica se o usuario ja existe
    if (usuarioExistente) {
      res.status(409).json({ msg: "Usuário já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao registrar o usuário.", error: error.message });
  }
});

export default router;
