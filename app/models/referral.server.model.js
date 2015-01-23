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
		default: '',
		required: 'Please fill Referral email',
		trim: true
	},
	open: {
		type: Number
	},
	clicks: {
		type: Number
	},
	referrals: {
		type: Number
	},
	submissions: {
		type: Number
	},
	customMessage: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Referral', ReferralSchema);
