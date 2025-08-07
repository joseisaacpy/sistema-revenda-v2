// IMPORTS
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

// MIDDLEWARE (será usudo nas rotas protegidas)
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Logs informativos
  // console.log("Todos os headers recebidos:", req.headers); // <-- Adicione isso
  // console.log("Authorization header recebido:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "Token não encontrado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log("Token válido:", decoded);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Token inválido:", error.message);
    res.status(403).json({ msg: "Token inválido." });
  }
}
