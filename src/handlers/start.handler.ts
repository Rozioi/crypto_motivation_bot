import { Context } from "grammy";
import { UserService } from "../services/user.service";
import { User } from "../types/user.type";
export async function StartHandler(ctx: Context) {
  const user: User = UserService.getOrCreate(
    String(ctx.from!.id),
    String(ctx.from!.username),
  );
  await ctx.reply(`Привет! Твоя роль: ${user.role}`);
}
