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
var SubmissionSchema = new Schema({
	listing: {
		type: Schema.ObjectId,
		required: 'Please fill in a Submission listing',
		ref: 'Listing'
	},
	referral: {
		type: Schema.ObjectId,
		ref: 'Referral'
	},
	email: {
		type: String,
		trim: true,
		default: '',
		required: 'Please fill in email',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	firstName: {
		type: String,
		required: 'Please fill in first name',
		trim: true
	},
	lastName: {
		type: String,
		required: 'Please fill in last name',
		trim: true
	},
	linkedInUrl: {
		type: String
	},
	uploadedResumeUrl: {
		type: String
	}
});

SubmissionSchema.plugin(deepPopulate);
SubmissionSchema.plugin(timestamps);
mongoose.model('Submission', SubmissionSchema);
