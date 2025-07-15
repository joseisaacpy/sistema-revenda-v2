// Imports
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

// Configura o dotenv
dotenv.config();

// Constantes
const port = process.env.PORT || 8080;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleares
app.use(express.json()); // Para receber dados no formato JSON
app.use(express.urlencoded({ extended: true })); // Para receber dados de formulários

// Rotas
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Inicia o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
