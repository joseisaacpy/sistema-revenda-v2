// Imports
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
// Imports das Rotas
import clientesRoutes from "./Routes/clientes.js";
import veiculosRoutes from "./Routes/veiculos.js";
import vendasRoutes from "./Routes/vendas.js";
import authRoutes from "./Routes/auth.js";

// Configura o dotenv
dotenv.config();

// Constantes
const port = process.env.PORT || 8080;
const app = express();

// Limitador: limite de 100 requisições por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limite de 100 requisições por IP
  message: "Muitas requisições feitas por este IP. Tente novamente mais tarde.",
  standardHeaders: true, // Retorna informações no cabeçalho RateLimit
  legacyHeaders: false, // Desativa o cabeçalho `X-RateLimit-*`
});

// Middleares
app.use(
  cors({
    origin: "*", // ou especifique os domínios em produção
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // para aceitar cookies e headers com token
  })
);

app.use(express.json()); // Para receber dados no formato JSON
app.use(express.urlencoded({ extended: true })); // Para receber dados de formulários
app.use(limiter); // Aplica em todas as rotas o limitador

// Rotas
app.get("/", (req, res) => {
  res.send("Bem-vindo ao servidor!");
});
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/veiculos", veiculosRoutes);
app.use("/api/vendas", vendasRoutes);

// Inicia o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
