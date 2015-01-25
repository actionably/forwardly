'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Referral = mongoose.model('Referral'),
	_ = require('lodash');

/**
 * Create a Referral
 */
exports.create = function (req) {
	var listing = req.listing;
	var referral = new Referral(req.body);
	referral.listing = listing;
	return referral.savePromise();
};

/**
 * Show the current Referral
 */
exports.read = function (req) {
	return req.referral;
};

/**
 * Update a Referral
 */
exports.update = function (req) {
	var referral = req.referral;
	referral = _.extend(referral, req.body);
	return referral.savePromise();
};

/**
 * Delete an Referral
 */
exports.delete = function (req) {
	var referral = req.referral;
	return referral.removePromise();
};

/**
 * List of Referrals
 */
exports.list = function (req) {
	return Referral.find({listing:req.listing}).sort('-created').exec();
};

/**
 * Referral middleware
 */
exports.referralByID = function (req, id) {
	return Referral.findById(id).exec();
};

