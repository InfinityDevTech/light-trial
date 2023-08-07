"use strict";
const Schema = require('mongoose').Schema;
const SampleSchema = new Schema({
    name: { type: String, required: false, default: 'This is a sample schema, set more schemas in the /models directory!' },
    createdAt: { type: Date, required: false, default: Date.now() }
});
module.exports = { name: 'SampleSchema', schema: SampleSchema };
