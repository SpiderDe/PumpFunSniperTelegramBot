import TelegramBot, { Message } from 'node-telegram-bot-api';
import * as config from "./config";
import * as startController from "./controller/startController";
import { Log } from './log';

export const bot = new TelegramBot(config.telegram_bot_token, { polling: true });

export const init = () => {

    bot.setMyCommands(
        [
            { command: 'start', description: 'show main menu' }
        ],
    );

    bot.onText(/\/start/, onStartCommand);

    bot.on('message', (msg) => {

    });

    bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
        const chatId = query.message!.chat.id;
        const messageId = query.message!.message_id;
        const data = query.data;
        Log(`CallbackQuery user: ${chatId}, data: ${data}`);
        if (data?.startsWith('cmd0_')) {
            startController.handleCommand(chatId, messageId, data);
        }
    });
}

export const onStartCommand = (msg: TelegramBot.Message) => {
    startController.showMenu(msg);
}

export const adminAlert = (message: string) => {
    bot.sendMessage(config.admin_telegram_chatid, message);
}

export const getUserInfo = (message: TelegramBot.Message) => {
    const chatId = message.chat.id;
    const userName = message.chat.username;
    return { chatId, userName };
}

export const sendMessageWithButtons = (chatId: TelegramBot.ChatId, message: string, buttons: any) => {
    bot.sendMessage(chatId, message, {
        parse_mode: "HTML", reply_markup: {
            inline_keyboard: buttons
        },
    });
}

export const sendMessage = (chatId: TelegramBot.ChatId, message: string) => {
    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
}

export const switchMenu = async (chatId: TelegramBot.ChatId, messageId: number | undefined, title: string, json_buttons: any) => {

    const keyboard = {
        inline_keyboard: json_buttons,
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true
    };

    try {
        await bot.editMessageText(title, { chat_id: chatId, message_id: messageId, reply_markup: keyboard, disable_web_page_preview: true, parse_mode: 'HTML' })
    } catch (error) {
        console.log(error)
    }

}
