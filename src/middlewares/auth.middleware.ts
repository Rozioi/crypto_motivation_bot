import { MiddlewareFn } from "grammy";
import type { MyContext } from "../../index";
import { UserRepo } from "../db/repositories/user.repo";

export const authMiddleware: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (!ctx.from) {
    await next(); // ❗️ ОБЯЗАТЕЛЬНО
    return;
  }

  const user = UserRepo.getByTelegramId(String(ctx.from.id));

  if (!user) {
    await ctx.reply("Нет доступа");
    await next(); // ❗️ ВСЁ РАВНО ПРОПУСКАЕМ
    return;
  }

  ctx.state.user = user;
  await next(); // ❗️ ВСЕГДА
};
