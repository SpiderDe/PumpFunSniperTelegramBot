import TelegramBot, { Message } from 'node-telegram-bot-api';
import * as config from "./config";

const bot = new TelegramBot(config.telegram_bot_token, { polling: true });

export const init = () => {

    bot.setMyCommands(
        [
            { command: 'start', description: 'show main menu' }
        ],
    );

    bot.onText(/\/start/, onStartCommand);

    bot.on('message', (msg) => {

    });
}

export const onStartCommand = (msg: TelegramBot.Message) => {

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
