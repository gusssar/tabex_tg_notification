import TelegramBot from "node-telegram-bot-api";

const TOKEN = "1195266209:AAG-kw2EXlmTwLK1EkigcP-3aw0uffF-0Oo";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (mes) => {
  bot.sendMessage(mes.chat.id, "hello");
});
