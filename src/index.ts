import * as database from "./database";
import * as bot from "./bot";

const main = async () => {

    console.log('Sniper bot started!');

    try {

        await database.connect();

        bot.init();

    } catch (error) {
        console.log(`Bot start error: ${error}`);
        process.exit(1);
    }

}

main();