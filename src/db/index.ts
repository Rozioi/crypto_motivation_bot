import Database from "better-sqlite3";

export const db = new Database("bot.db", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    telegramId TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS access (
    telegramId INTEGER PRIMARY KEY,
    paymentId TEXT,
    access INTEGER,
    updatedAt TEXT
  );
`);
