import express from "express";
import cors from "cors";
import campaignsRouter from "./routes/campaigns";
import landingRouter from "./routes/landing";
import submissionsRouter from "./routes/submissons";
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
app.use("/api/landing", landingRouter);
app.use("/api/submissions", submissionsRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});