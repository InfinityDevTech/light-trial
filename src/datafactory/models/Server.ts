const Schema = require('mongoose').Schema;

const Server = new Schema({
	id: {type: String, required: true},
	welcomeChannel: {type: String, required: false, default: ""},
});

module.exports = { name: 'Server', schema: Server }