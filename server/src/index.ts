import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes/registerRoutes.js";

const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "5mb" }));

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`SOC API listening on http://127.0.0.1:${PORT}`);
});
