'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
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
	}
});

CompanySchema.plugin(deepPopulate);
CompanySchema.plugin(timestamps);
mongoose.model('Company', CompanySchema);
