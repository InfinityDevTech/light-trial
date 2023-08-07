"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./../logger"));
const basename = path_1.default.basename(module.filename);
const modelPath = path_1.default.join(__dirname, 'models');
class DataFactory {
    constructor(options) {
        //@ts-ignore
        this.logger = new logger_1.default(options.logger || {});
        this._models = {};
        this.logger.info('Connecting to mongodb...');
        mongoose_1.default.Promise = global.Promise;
        const connectOpts = options.connectOps || {
            useNewUrlParser: true,
        };
        if (!options.disableReplica) {
            connectOpts.replicaSet = 'light';
        }
        mongoose_1.default.connect(options.dbString, connectOpts);
        const connection = mongoose_1.default.connection;
        connection.on('error', this.logger.error);
        connection.once('open', () => this.logger.info('Connected to mongo.'));
        fs_1.default
            .readdirSync(modelPath)
            .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
            .forEach((file) => {
            const model = require(path_1.default.join(modelPath, file));
            this.registerModel(model);
        });
    }
    get models() {
        return this._models;
    }
    get mongoose() {
        return mongoose_1.default;
    }
    get connection() {
        return mongoose_1.default.connection;
    }
    collection(...args) {
        return mongoose_1.default.connection.collection(...args);
    }
    get Schema() {
        return mongoose_1.default.Schema;
    }
    registerModel({ name, schema }) {
        const model = mongoose_1.default.model(name, schema);
        this._models[model.modelName] = model;
    }
}
module.exports = DataFactory;
