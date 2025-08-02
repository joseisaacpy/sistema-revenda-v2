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
        expiresIn: "1h",
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
    const hash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      "INSERT INTO usuarios(nome, email,senha) VALUES ($1,$2,$3) RETURNING id,nome,email",
      [nome, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ msg: "Usuário já cadastrado." });
    }
    res
      .status(500)
      .json({ msg: "Erro ao registrar o usuário.", error: error.message });
  }
});

export default router;
