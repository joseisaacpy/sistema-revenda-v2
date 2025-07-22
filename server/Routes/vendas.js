// IMPORTS
import express from "express";
import db from "../Database/connection.js"; // Seu pool de conexão com o PostgreSQL

// CONSTANTES
const router = express.Router();

// CREATE - Registrar uma nova venda
router.post("/", async (req, res) => {
  // Desestruturar os dados do corpo da requisição
  const {
    id_veiculo,
    id_cliente,
    data_venda, // Virá do frontend em formato string 'YYYY-MM-DD'
    valor_venda,
    forma_pagamento,
    observacoes,
  } = req.body;

  // --- 1. Validação Básica dos Dados Recebidos ---
  // Verifica se todos os campos obrigatórios estão presentes
  if (!id_veiculo || !id_cliente || !valor_venda || !forma_pagamento) {
    return res.status(400).json({
      error:
        "Todos os campos obrigatórios (id_veiculo, id_cliente, valor_venda, forma_pagamento) devem ser preenchidos.",
    });
  }

  // Validação de tipos (opcional, mas recomendado para segurança extra)
  if (
    typeof id_veiculo !== "number" ||
    typeof id_cliente !== "number" ||
    isNaN(valor_venda)
  ) {
    return res.status(400).json({
      error: "id_veiculo, id_cliente e valor_venda devem ser números válidos.",
    });
  }

  // Valida se o valor de venda é positivo
  if (parseFloat(valor_venda) <= 0) {
    return res
      .status(400)
      .json({ error: "O valor da venda deve ser um número positivo." });
  }

  // Inicia uma transação de banco de dados
  const client = await db.connect(); // Obtém um cliente do pool de conexões
  try {
    await client.query("BEGIN"); // Inicia a transação

    // --- 2. Verificar a Disponibilidade do Veículo ---
    // Consulta o veículo e o bloqueia para evitar que outro processo o venda simultaneamente
    const veiculoResult = await client.query(
      "SELECT status FROM veiculos WHERE id = $1 FOR UPDATE",
      [id_veiculo]
    );

    // Se o veículo não existe
    if (veiculoResult.rows.length === 0) {
      await client.query("ROLLBACK"); // Reverte a transação
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    // Se o veículo já foi vendido
    if (veiculoResult.rows[0].status === "vendido") {
      await client.query("ROLLBACK"); // Reverte a transação
      return res
        .status(409)
        .json({ error: "Este veículo já foi vendido e não está disponível." }); // 409 Conflict
    }

    // --- 3. Verificar se o Cliente Existe ---
    // Embora o FOREIGN KEY ajude, uma verificação explícita antes pode dar uma mensagem melhor
    const clienteResult = await client.query(
      "SELECT id FROM clientes WHERE id = $1",
      [id_cliente]
    );

    if (clienteResult.rows.length === 0) {
      await client.query("ROLLBACK"); // Reverte a transação
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // --- 4. Registrar a Venda na Tabela 'vendas' ---
    const insertVendaQuery = `
      INSERT INTO vendas (id_veiculo, id_cliente, data_venda, valor_venda, forma_pagamento, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; -- Retorna a linha inserida
    `;
    const vendaResult = await client.query(insertVendaQuery, [
      id_veiculo,
      id_cliente,
      data_venda || new Date().toISOString().slice(0, 10), // Usa a data da requisição ou a data atual como fallback
      parseFloat(valor_venda),
      forma_pagamento,
      observacoes,
    ]);

    // --- 5. Atualizar o Status do Veículo para 'vendido' ---
    const updateVeiculoQuery = `
      UPDATE veiculos
      SET status = 'vendido'
      WHERE id = $1;
    `;
    await client.query(updateVeiculoQuery, [id_veiculo]);

    // --- 6. Confirmar a Transação ---
    await client.query("COMMIT"); // Confirma todas as operações

    // Resposta de sucesso
    res.status(201).json({
      message: "Venda registrada com sucesso!",
      venda: vendaResult.rows[0], // Retorna os dados da venda recém-criada
    });
  } catch (error) {
    // Em caso de qualquer erro, reverte a transação
    await client.query("ROLLBACK");
    console.error("Erro ao registrar venda:", error);
    // Retorna um erro genérico 500 para o cliente, logando o erro detalhado no servidor
    res.status(500).json({
      error:
        "Erro interno do servidor ao registrar a venda. Por favor, tente novamente.",
    });
  } finally {
    // Libera o cliente de volta para o pool de conexões
    client.release();
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const vendas = await db.query("SELECT * FROM vendas");
    if (vendas.rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma venda encontrada." });
    }
    res.json(vendas.rows);
  } catch (error) {
    console.error("Erro ao buscar as vendas", error);
  }
});

export default router;
