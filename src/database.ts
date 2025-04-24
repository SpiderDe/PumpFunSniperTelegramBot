import mongoose from "mongoose";
import * as config from "./config";

export const connect = async () => {
    await mongoose.connect(config.database_uri);
}