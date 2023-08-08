const Schema2 = require('mongoose').Schema;

const Cron = new Schema2({
	id: {type: String, required: true},
	cron: {type: String, required: true},
    channel: {type: String, required: true},
    message: {type: String, required: true},
});

module.exports = { name: 'Cron', schema: Cron }