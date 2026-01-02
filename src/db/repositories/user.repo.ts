import { db } from "../index";
import { User } from "../../types/user.type";

export const UserRepo = {
  getByTelegramId: (telegramId: string): User => {
    return db
      .prepare("SELECT * FROM users WHERE telegramId = ?")
      .get(telegramId);
  },
  createUser: (telegramId: string, username: string, role: string = "user") => {
    return db
      .prepare(
        "INSERT INTO users ( telegramId, username, role, createdAt) VALUES ( ?, ?, ?, datetime('now'))",
      )
      .run(telegramId, username, role);
  },
};
