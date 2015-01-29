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
		required: 'Please fill Submission listing',
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
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	firstName: {
		type: String,
		trim: true
	},
	lastName: {
		type: String,
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
