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
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
    firstName : {
        type: String,
        trim: true,
        default: ''
    },
    lastName : {
        type: String,
        trim: true,
        default: ''
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
