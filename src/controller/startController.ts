import TelegramBot from "node-telegram-bot-api";
import * as database from "../database";
import * as solana from "../solanaLib/web3";

import {
    bot,
    getUserInfo,
    sendMessage,
    sendMessageWithButtons,
    switchMenu
} from "../bot";

import * as config from "../config";
import { Log } from "../log";
import { PublicKey } from "@solana/web3.js";

export const getUI = async (chatId: number) => {
    const user = await database.getUser(chatId);
    const setting = await database.getSetting(chatId);

    if (!user || !setting) {
        Log(`There is not such user chatId: ${chatId}`);
        return;
    }

    const solBalance = await solana.getSolBalance(new PublicKey(user.publicKey));

    const message = `${config.telegram_bot_name}\n\nWallet: ${solBalance} SOL\n${user?.publicKey}`;

    const buttons = [
        [
            { text: `${setting.isRunning ? "🟩 started" : "🟥 stopped"}`, callback_data: `${setting.isRunning ? "cmd0_stop_bot" : "cmd0_start_bot"}` }
        ],
        [
            { text: `buy amount: ${setting.buyAmount} SOL`, callback_data: `cmd0_set_buy_amount` }
        ],
        [
            { text: `take profit: ${setting.takeProfit} %`, callback_data: 'cmd0_set_tp' }
        ],
        [
            { text: `stop loss: ${setting.stopLoss} %`, callback_data: 'cmd0_set_sl' }
        ],
        [
            { text: `jito fee: ${setting.jitoFee} SOL`, callback_data: 'cmd0_set_jito_fee' }
        ]
    ];

    return { message, buttons };
}

export const showMenu = async (msg: TelegramBot.Message) => {
    const { chatId, userName } = getUserInfo(msg);
    Log(`user: ${userName}`);
    let user = database.getUser(chatId);
    if (!user) {
        const { publicKey, privateKey } = solana.createWallet();
        await database.newUser(chatId, userName || '', publicKey, privateKey);
    }
    const ui = await getUI(chatId);
    if (ui) {
        sendMessageWithButtons(chatId, ui.message, ui.buttons);
    }
}

export const updateMenu = async (chatId: number, messageId: number) => {
    const ui = await getUI(chatId);
    if (ui) {
        switchMenu(chatId, messageId, ui.message, ui.buttons);
    }
}

export const handleCommand = (chatId: number, messageId: number, data: string) => {
    Log(`startController.handleCommand: chatId: ${chatId} messageId: ${messageId} data: ${data}`);

    if (data === "cmd0_stop_bot") {
        database.updateSetting(chatId, { isRunning: false });

    } else if (data === "cmd0_start_bot") {
        database.updateSetting(chatId, { isRunning: true });

    } else if (data === "cmd0_set_buy_amount") {
        sendMessage(chatId, `Please input buying amount in SOL.`);
        bot.once('message', async (msg) => {
            const buyAmount = Number(msg.text);
            if (buyAmount <= 0) {
                sendMessage(chatId, `Invalid value.`);
            } else {
                await database.updateSetting(chatId, { buyAmount: buyAmount });
                updateMenu(chatId, messageId);
            }
        })

    } else if (data === "cmd0_set_tp") {
        sendMessage(chatId, `Please input percent of take profit.`);
        bot.once('message', async (msg) => {
            const percent = Number(msg.text);
            if (percent <= 0) {
                sendMessage(chatId, `Invalid value.`);
            } else {
                await database.updateSetting(chatId, { takeProfit: percent });
                updateMenu(chatId, messageId);
            }
        })

    } else if (data === "cmd0_set_sl") {
        sendMessage(chatId, `Please input percent of stop loss.`);
        bot.once('message', async (msg) => {
            const percent = Number(msg.text);
            if (percent <= 0 || percent > 100) {
                sendMessage(chatId, `Invalid value.`);
            } else {
                await database.updateSetting(chatId, { stopLoss: percent });
                updateMenu(chatId, messageId);
            }
        })

    } else if (data === "cmd0_set_jito_fee") {
        sendMessage(chatId, `Please input jito fee amount in SOL`);
        bot.once('message', async (msg) => {
            const amount = Number(msg.text);
            if (amount <= 0) {
                sendMessage(chatId, `Invalid value.`);
            } else {
                await database.updateSetting(chatId, { jitoFee: amount });
                updateMenu(chatId, messageId);
            }
        })
    }
}