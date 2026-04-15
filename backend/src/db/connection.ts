import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

//create the data directory first and then open or create the database file inside it
const dataDir = path.join(process.cwd(),"data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "app.db");

export const db = new Database(dbPath);
db.pragma("foreign_keys = ON");