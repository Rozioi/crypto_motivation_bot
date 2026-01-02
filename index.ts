import { Bot } from "grammy";
import CryptoBotApi from "crypto-bot-api";
import { PaymentService } from "./src/services/payment.service";
import { authMiddleware } from "./src/middlewares/auth.middleware";
import dotenv from "dotenv";
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);

export const cryptoClient = new CryptoBotApi(
  process.env.CRYPTO_BOT_KEY!,
  "testnet",
);
bot.command("start", async (ctx) => {
  const invoice = await PaymentService.createInvoice(
    200,
    "TRX",
    "Доступ к упражнению «День мышления»",
  );

  await ctx.reply(
    `🧠 *День мышления*\n\n` +
      `Чтобы продолжить, пожалуйста, оплати доступ к упражнению.\n\n` +
      `💰 *Стоимость:* ${invoice.amount} TRX\n\n` +
      `👉 *Выбери удобный способ оплаты:*\n` +
      `🔹 [Оплатить в CryptoBot](${invoice.botPayUrl})\n` +
      `🔹 [Оплатить в Mini App](${invoice.miniAppPayUrl})\n\n` +
      `После успешной оплаты доступ откроется автоматически ✅`,
    {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    },
  );
});

bot.command("check", authMiddleware, async (ctx) => {
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
