import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactions.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(ratelimiter);

app.use(express.json());

app.use("/api/transactions", transactionsRouter);

initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port 5001");
  });
});
