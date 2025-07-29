// IMPORTS
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

// MIDDLEWARES (será usudo nas rotas protegidas)
export function verificarToker(req, res, next) {
  const token = req.headers.autorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token não encontrado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Token inválido." });
  }
}
