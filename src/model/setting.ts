import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
    chatId: number;
    isRunning: boolean;
    buyAmount: number;
    takeProfit: number;
    stopLoss: number;
    jitoFee: number;
}

const SettingSchema: Schema = new Schema({
    chatId: { type: Number, required: true },
    isRunning: { type: Boolean, required: true, default: false },
    buyAmount: { type: Number, required: true, default: 0.01 },
    takeProfit: { type: Number, required: true, default: 50 },
    stopLoss: { type: Number, required: true, default: 20 },
    jitoFee: { type: Number, required: true, default: 0.0001 }
});

export const Setting = model<ISetting>('Setting', SettingSchema);