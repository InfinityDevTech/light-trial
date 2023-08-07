const Logger = require('./logger');
const DataFactory = require('./datafactory/DataFactory');
const config = require('./config');

const Eris = require('eris');

function main() {
    const logger = new Logger({});
    const datafactory = new DataFactory(config);

    Eris.
}

main();