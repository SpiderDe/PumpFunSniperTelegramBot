import { logTag } from "./config"

export const Log = (message: string) => {
    console.log(`[${logTag}] ${message}`);
}