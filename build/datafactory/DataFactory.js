"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Logger = require('./../logger');
const basename = path.basename(module.filename);
const modelPath = path.join(__dirname, 'models');
class DataFactory {
    constructor(options) {
        this.logger = new Logger.Logger(options.logger || {});
        this._models = {};
        this.logger.info('Connecting to mongodb...');
        this.logger.debug('dbString: ' + options.dbString);
        mongoose.Promise = global.Promise;
        const connectOpts = options.connectOps || {
            useNewUrlParser: true,
        };
        //if (!options.disableReplica) {
        //	connectOpts.replicaSet = 'light';
        //}
        mongoose.connect(options.dbString, connectOpts);
        const connection = mongoose.connection;
        connection.on('error', (e) => this.logger.error(e));
        connection.once('open', () => this.logger.info('Connected to mongo.'));
        fs
            .readdirSync(modelPath)
            .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
            .forEach((file) => {
            const model = require(path.join(modelPath, file));
            this.registerModel(model);
        });
    }
    get models() {
        return this._models;
    }
    get mongoose() {
        return mongoose;
    }
    get connection() {
        return mongoose.connection;
    }
    collection(...args) {
        return mongoose.connection.collection(...args);
    }
    get Schema() {
        return mongoose.Schema;
    }
    registerModel({ name, schema }) {
        const model = mongoose.model(name, schema);
        this._models[model.modelName] = model;
    }
}
exports.default = DataFactory;
module.exports = DataFactory;
