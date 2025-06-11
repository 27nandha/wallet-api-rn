import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactions.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

if (process.env.NODE_ENV == "production") job.start(); // Start the cron job only in production

app.use(ratelimiter);

app.use(express.json());

app.use("/api/transactions", transactionsRouter);

initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port 5001");
  });
});
