const Logger = require('./logger');
import DataFactory from "./datafactory/DataFactory";
import config from "./config";

import Eris from "eris"
import Events from "./events";

async function main() {
    const logger = new Logger.Logger(config.logger || {});

    if (config.logger && config.logger.level == "debug") {
        logger.debug("---------- IMPORTANT ----------")
        logger.debug("Debug mode can be very verbose,")
        logger.debug("causing the bot to leak sensitive info")
        logger.debug("such as tokens and database credentials.")
        logger.debug("If you acknowledge this, you may continue.")
        logger.debug("---------- IMPORTANT ----------")
        logger.debug("Press any key to continue...")
        await keypress();
    }

    const datafactory = new DataFactory(config);

    logger.debug(`Logging into bot with token ${config.token}`)

    const bot = new Eris.Client(config.token, {
        intents: 3276799
    });

    bot.on("ready", () => {
        logger.info("Bot is ready and is logged in!");
        new Events(bot, logger, datafactory);
    })

    bot.connect();
}

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise<void>(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }

main();