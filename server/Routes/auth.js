// IMPORTS
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Database/connection.js";

// CONSTANTES
const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

// ROTAS

// LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const usuario = result.rows[0];

    // Faz a verificação da senha inserida com a do banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    // Se a senha for incorreta
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }
    const token = jwt.sign({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
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
  try {
    const hash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      "INSERT INTO usuarios(nome, email,senha) VALUES ($1,$2,$3) RETURNING id,nome,email",
      [nome, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao registrar o usuário.", error: error.message });
  }
});

export default router;
