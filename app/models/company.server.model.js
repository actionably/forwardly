'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Company name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Company description',
		trim: true
	},
	url: {
		type: String,
		default: '',
		required: 'Please fill Company url',
		trim: true
	},
	imageUrl: {
		type: String,
		default: '',
		required: 'Please fill Company imageUrl',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Company', CompanySchema);
