import { create } from "@grammyjs/conversations";
import { db } from "../index";
export const AccessRepo = {
  create: async (telegramId: number, paymentId: string, access: number = 0) => {
    db.prepare(
      "INSERT INTO access (telegramId, paymentId, access) VALUES (?, ?, ?)",
    ).run(telegramId, paymentId, access);
  },
  get: async (telegramId: number) => {
    const result = db
      .prepare("SELECT * FROM access WHERE telegramId = ?")
      .get(Number(telegramId));
    return result;
  },
  upsert: (telegramId: number, paymentId: string, access = 0) => {
    db.prepare(
      `
      INSERT INTO access (telegramId, paymentId, access, updatedAt)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(telegramId)
      DO UPDATE SET
        paymentId = excluded.paymentId,
        access = excluded.access,
        updatedAt = excluded.updatedAt
    `,
    ).run(telegramId, paymentId, access, new Date().toISOString());
  },

  updateAccess: async (
    telegramId: number,
    access: boolean,
    paymentId?: string,
  ) => {
    db.prepare(
      `
      UPDATE access
      SET
        access = ?,
        paymentId = COALESCE(?, paymentId),
        updatedAt = ?
      WHERE telegramId = ?
    `,
    ).run(
      access ? 1 : 0,
      paymentId ?? null,
      new Date().toISOString(),
      telegramId,
    );
  },
};
