//@ts-ignore
const schema = require('mongoose').Schema;

const User = new schema({
	id: {type: String, required: true},
	servers: [
		{
			serverId: {type: String, required: true, default: ""},
			messageCount: {type: Number, required: true, default: 0}
		}
	],
	createdAt: {type: Date, required: false, default: Date.now()}
});

module.exports = { name: 'User', schema: User }