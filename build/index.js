"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const TOKEN = "1195266209:AAG-kw2EXlmTwLK1EkigcP-3aw0uffF-0Oo";
const keyboard = [
    [
        {
            text: "pill_intaked",
            callback_data: "pill_intaked",
        },
    ],
];
const getIntervalAndCountPill = (date) => {
    if (/^(16|17|18)$/.test(date)) {
        return { countPill: 6, intervalPill: 7200000 };
    }
    if (/^(19|20|21|22|23|24|25|26|27)$/) {
        return { countPill: 5, intervalPill: 9000000 };
    }
    if (/^(28|29|30|1)$/) {
        return { countPill: 4, intervalPill: 10800000 };
    }
    if (/^(2|3|4|5)$/) {
        return { countPill: 3, intervalPill: 18000000 };
    }
    if (/^(6|7|8|9)$/) {
        return { countPill: 2, intervalPill: 21600000 };
    }
    if (/^10$/) {
        return { countPill: 1, intervalPill: 0 };
    }
};
const bot = new node_telegram_bot_api_1.default(TOKEN, { polling: true });
const pillIntake = () => {
    const data = new Date().getDate().toString();
    const { countPill, intervalPill } = getIntervalAndCountPill(data);
    let count = countPill;
    let interval = intervalPill;
    return function (chatId, force) {
        if (force) {
            const dataForce = new Date().getDate().toString();
            const { countPill, intervalPill } = getIntervalAndCountPill(dataForce);
            count = countPill;
            interval = intervalPill;
            bot.sendMessage(chatId, `Прими таблетку, осталось ещё ${count}`, {
                reply_markup: {
                    keyboard,
                    one_time_keyboard: true,
                },
            });
            return;
        }
        if (count) {
            bot.sendMessage(chatId, `С этим пока всё, следующая через ${interval / 3600000} часа, я тебе напомню`);
            count--;
            setTimeout(() => {
                bot.sendMessage(chatId, `Прими таблетку, осталось ещё ${count}`, {
                    reply_markup: {
                        keyboard,
                        one_time_keyboard: true,
                    },
                });
            }, interval);
            return;
        }
        bot.sendMessage(chatId, "На сегодня всё, завтра набери /first_pill_intake чтобы начать приёмный цикл");
    };
};
const getPillIntake = pillIntake();
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (msg.text) {
        const text = msg.text.toLowerCase();
        if (/first_pill_intake/.test(text)) {
            getPillIntake(chatId, true);
        }
        else if (/pill_intaked/.test(text)) {
            getPillIntake(chatId);
        }
        else {
            bot.sendMessage(chatId, "Если это первый приём выбери /first_pill_intake");
        }
    }
});
