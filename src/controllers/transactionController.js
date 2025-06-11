import { sql } from "../config/db.js";

async function createTransactions(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *;`;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error inserting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getTransactions(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: result[0],
    });
  } catch (error) {
    console.log("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function summary(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id = ${userId};`;
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount),0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0;`;
    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount),0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0;`;
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses,
    });
  } catch (error) {
    console.log("Error fetching summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getTransactions, deleteTransaction, createTransactions, summary };
