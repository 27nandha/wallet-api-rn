import express from "express";
import {
  createTransactions,
  deleteTransaction,
  getTransactions,
  summary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransactions);

router.get("/:userId", getTransactions);

router.delete("/:id", deleteTransaction);

// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, amount, category } = req.body;
//     if (!title || amount === undefined || !category) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     const updatedTransaction =
//       await sql`UPDATE transactions SET title = ${title}, amount = ${amount}, category = ${category} WHERE id = ${id} RETURNING *;`;
//     if (updatedTransaction.length === 0) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }
//     res.status(200).json(updatedTransaction[0]);
//   } catch (error) {
//     console.log("Error updating transaction:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/summary/:userId", summary);

export default router;
