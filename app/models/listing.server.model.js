'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

/**
 * Listing Schema
 */
var ListingSchema = new Schema({
	headline: {
		type: String,
		default: '',
		required: 'Please fill Listing headline',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Listing description',
		trim: true
	},
	location: {
		type: String,
		default: '',
		required: 'Please fill Listing location',
		trim: true
	},
	role: {
		type: String,
		required: 'Please fill Listing role',
		enum: ['Software Engineer', 'Backend Developer', 'Data Scientist', 'DevOps', 'Frontend Developer', 'Full-Stack Developer',
		'Mobile Developer', 'Attorney', 'UI/UX Designer', 'Finance/Accounting', 'Hardware Engineer', 'H.R.', 'Marketing',
		'Office Manager', 'Operations', 'Product Manager', 'Sales']
	},
	tags: {
		type: String
	},
	referralFee : {
		type: Number,
		required: 'Please fill Listing referralFee'
	},
	user: {
		type: Schema.ObjectId,
		required: 'Please fill Listing user',
		ref: 'User'
	},
	company: {
		type: Schema.ObjectId,
		required: 'Please fill Listing company',
		ref: 'Company'
	}
});

ListingSchema.plugin(deepPopulate);
ListingSchema.plugin(timestamps);
mongoose.model('Listing', ListingSchema);
