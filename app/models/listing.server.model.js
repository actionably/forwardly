'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Listing Schema
 */
var ListingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Listing name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Listing', ListingSchema);