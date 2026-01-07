import { Bot, InlineKeyboard, Keyboard } from "grammy";
import CryptoBotApi from "crypto-bot-api";
import { AccessRepo } from "./src/db/repositories/access.repo";
import { PaymentService } from "./src/services/payment.service";
import { authMiddleware } from "./src/middlewares/auth.middleware";
import dotenv from "dotenv";
dotenv.config();
import { session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { UserRepo } from "./src/db/repositories/user.repo";
type Sponsor = {
  name: string;
  username: string;
};

const sponsors: Sponsor[] = [
  { name: "devdigger", username: "@devdigger" },
  { name: "itfromrozioi", username: "@itfromrozioi" },
];
const bot = new Bot(process.env.BOT_TOKEN!);

export const cryptoClient = new CryptoBotApi(
  process.env.CRYPTO_BOT_KEY!,
  "testnet",
);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function isSubscribed(ctx) {
  try {
    for (const s of sponsors) {
      const member = await ctx.api.getChatMember(s.username, ctx.from.id);

      if (!["member", "administrator", "creator"].includes(member.status)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function createUser(ctx) {
  try {
    const res = UserRepo.createUser(ctx.from.id, ctx.from.username, "member");
    console.log(res);
    if (!res) {
    }
  } catch (err) {
    console.error("Error in process creating user, problem:", err);
  }
}

function sponsorsKeyboard() {
  const kb = new InlineKeyboard();

  for (const s of sponsors) {
    kb.url(`📢 ${s.name}`, `https://t.me/${s.username.replace("@", "")}`).row();
  }

  kb.text("💳 Оплатить взнос", "pay")
    .row()
    .text("🔍 Проверить доступ", "check");

  return kb;
}

bot.command("start", async (ctx) => {
  const ok = await isSubscribed(ctx);

  if (ok) {
    await ctx.reply("✅ Доступ открыт");
    return;
  }

  await ctx.reply(
    "Чтобы пользоваться ботом:\n" +
      "1️⃣ Подпишись на всех спонсоров\n" +
      "2️⃣ Оплати взнос",
    { reply_markup: sponsorsKeyboard() },
  );
});
bot.command("addsponsor", async (ctx) => {
  const [, username] = ctx.message.text.split(" ");
  sponsors.push({ name: username.replace("@", ""), username });
  console.log(sponsors, username);
  await ctx.reply("✅ Спонсор добавлен");
});
bot.callbackQuery("pay", async (ctx) => {
  const invoice = await PaymentService.createInvoice(
    200,
    "TRX",
    "Подписка на проект",
  );

  AccessRepo.upsert(ctx.from.id, invoice.id, 0);

  await ctx.reply(
    `💳 Оплата\n\n` +
      `Сумма: ${invoice.amount} TRX\n\n` +
      `[Оплатить](${invoice.botPayUrl})`,
    { parse_mode: "Markdown" },
  );
});

bot.callbackQuery("check", async (ctx) => {
  const record = await AccessRepo.get(ctx.from.id);

  if (!record) {
    await ctx.reply("❌ У тебя нет счёта на оплату");
    return;
  }

  const invoices = await cryptoClient.getInvoices({
    invoiceIds: [Number(record.paymentId)],
  });

  if (!invoices.length) {
    await ctx.reply("❌ Счёт не найден");
    return;
  }

  const invoice = invoices[0];

  if (invoice.status === "paid") {
    await AccessRepo.updateAccess(ctx.from.id, true, record.paymentId);
    await ctx.reply("✅ Оплата подтверждена, доступ открыт");
  } else if (invoice.status === "active") {
    await ctx.reply("⏳ Счёт ещё не оплачен");
  } else {
    await ctx.reply("❌ Счёт просрочен");
  }
});

bot.command("give", authMiddleware, async (ctx) => {
  try {
    const check = await cryptoClient.createCheck({
      amount: 10,
      asset: "TRX",
      pinToUsername: ctx.chat.username,
    });

    await ctx.reply(`💰 Счёт создан!\n\n🔗 ${check.botCheckUrl}`);
  } catch {
    await ctx.reply("❌ Ошибка при создании счёта");
  }
});

bot.catch((err) => {
  console.error("🔥 Bot error:", err.error);
});

bot.start();
