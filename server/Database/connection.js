// Imports
import pg from "pg";
import dotenv from "dotenv";
// Configura o dotenv
dotenv.config();
// Instância o pool
const { Pool } = pg;

// Cria o pool
const pool = new Pool({
  max: 5, // Máximo de conexões simultaneas
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
// Função pra conectar com o banco
const connection = async () => {
  try {
    pool.connect();
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados", error);
  }
};
// Chama a função
connection();

export default pool;
