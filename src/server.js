import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionsRoute.js";
import cors from "cors";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "production") job.start();

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "https://wonderful-daifuku-32519b.netlify.app",
    ],
    credentials: true,
  })
);

//middleware
app.use(ratelimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
