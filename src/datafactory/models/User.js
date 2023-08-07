const Schema = require('mongoose').Schema;

const SampleSchema = new Schema({
	id: {type: String, required: true},
	
	createdAt: {type: Date, required: false, default: Date.now()}
});

module.exports = { name: 'SampleSchema', schema: SampleSchema }