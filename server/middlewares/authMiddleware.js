// IMPORTS
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

// MIDDLEWARES (será usudo nas rotas protegidas)
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token não encontrado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Token inválido." });
  }
}
