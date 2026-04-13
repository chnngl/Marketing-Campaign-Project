import express from "express";
import cors from "cors";
import campaignsRouter from "./routes/campaigns"
import {createTables, seedDatabase} from "./db/init";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

createTables();
seedDatabase();

app.get("/api/health", (_req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/campaigns", campaignsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});