"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require("./logger");
const DataFactory_1 = __importDefault(require("./datafactory/DataFactory"));
const config_1 = __importDefault(require("./config"));
const eris_1 = __importDefault(require("eris"));
const events_1 = __importDefault(require("./events"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new Logger.Logger(config_1.default.logger || {});
        if (config_1.default.logger && config_1.default.logger.level == "debug") {
            logger.debug("---------- IMPORTANT ----------");
            logger.debug("Debug mode can be very verbose,");
            logger.debug("causing the bot to leak sensitive info");
            logger.debug("such as tokens and database credentials.");
            logger.debug("If you acknowledge this, you may continue.");
            logger.debug("---------- IMPORTANT ----------");
            logger.debug("Press any key to continue...");
            yield keypress();
        }
        const datafactory = new DataFactory_1.default(config_1.default);
        logger.debug(`Logging into bot with token ${config_1.default.token}`);
        const bot = new eris_1.default.Client(config_1.default.token, {
            intents: 3276799,
        });
        bot.on("ready", () => {
            logger.info("Bot is ready and is logged in!");
            new events_1.default(bot, logger, datafactory);
        });
        bot.connect();
    });
}
const keypress = () => __awaiter(void 0, void 0, void 0, function* () {
    process.stdin.setRawMode(true);
    return new Promise((resolve) => process.stdin.once("data", () => {
        process.stdin.setRawMode(false);
        resolve();
    }));
});
function launch() {
    try {
        main();
    }
    catch (e) {
        Logger.error("The bot had an error... Attempting to restart it...");
        Logger.error(e);
        main();
        launch();
    }
}
launch();
