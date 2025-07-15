// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Rotas
import clientesRoutes from "./Routes/clientes.js";
import veiculosRoutes from "./Routes/veiculos.js";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// Configura o dotenv
dotenv.config();

// Constantes
const port = process.env.PORT || 8080;
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Middleares
// app.use(cors()); // Para permitir requisicoes de outras origens
app.use(cors());
app.use(express.json()); // Para receber dados no formato JSON
app.use(express.urlencoded({ extended: true })); // Para receber dados de formulários

// Rotas
app.use("/api/clientes", clientesRoutes);
app.use("/api/veiculos", veiculosRoutes);

// Inicia o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
