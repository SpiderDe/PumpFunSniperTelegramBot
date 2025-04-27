import mongoose from "mongoose";
import * as config from "./config";
import { User } from "./model/user";
import { Setting } from "./model/setting";

export const connect = async () => {
    await mongoose.connect(config.database_uri);
}

export const getUser = async (chatId: number) => {
    const user = await User.findOne({ chatId });
    return user;
}

export const newUser = async (chatId: number, userName: string, publicKey: string, privateKey: string) => {
    const user = new User({ chatId, userName, publicKey, privateKey });
    await user.save();
    const setting = new Setting({ chatId });
    await setting.save();
}

export const getSetting = async (chatId: number) => {
    const setting = await Setting.findOne({ chatId });
    return setting;
}

export const updateSetting = async (chatId: number, value: any) => {
    const setting = await Setting.findOneAndUpdate({ chatId }, { $set: value });
    return setting;
}