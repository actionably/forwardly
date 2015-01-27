'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Listing = mongoose.model('Listing'),
	Referral = mongoose.model('Referral'),
	_ = require('lodash');

/**
 * Create a Listing
 */
exports.create = function (req) {
	var listing = req.body;
	listing.user = req.user;
	return Listing.create(listing);
};

function addReferrals(listing) {
	return Referral.find({listing:listing}).sort('-created').exec().then(
		function(referrals) {
			var listing2 = listing.toObject();
			listing2.referrals = referrals;
			return listing2;
		}
	);
}

/**
 * Show the current Listing
 */
exports.read = function (req) {
	var listing = req.listing;
	return addReferrals(listing);
};

/**
 * Update a Listing
 */
exports.update = function (req) {
	var listing = req.listing;
	listing = _.extend(listing, req.body);
	return listing.savePromise().then(function (listing) {
		return addReferrals(listing);
	});
};

/**
 * Delete an Listing
 */
exports.delete = function (req) {
	var listing = req.listing;
	return listing.removePromise();
};

/**
 * List of Listings
 */
exports.list = function (req) {
	return Listing.find().sort('-created').populate('user', 'displayName').populate('company').exec();
};

/**
 * Listing middleware
 */
exports.listingByID = function (req, id) {
	return Listing.findById(id).populate('user', 'displayName').populate('company').exec();
};

/**
 * Listing authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.listing.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
