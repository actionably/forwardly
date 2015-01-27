'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Listing Schema
 */
var ReferralSchema = new Schema({
	listing: {
		type: Schema.ObjectId,
		required: 'Please fill Referral listing',
		ref: 'Listing'
	},
	parentReferral: {
		type: Schema.ObjectId,
		ref: 'Referral'
	},
	email: {
		type: String,
		trim: true,
		default: '',
        required: 'Please enter an email address',
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
	open: {
		type: Number,
		default: 0
	},
	clicks: {
		type: Number,
		default: 0
	},
	referrals: {
		type: Number,
		default: 0
	},
	submissions: {
		type: Number,
		default: 0
	},
	customMessage: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Referral', ReferralSchema);
