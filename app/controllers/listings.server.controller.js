'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Listing = mongoose.model('Listing'),
	_ = require('lodash');

/**
 * Create a Listing
 */
exports.create = function (req) {
	var listing = req.body;
	listing.user = req.user;
	return Listing.create(listing);
};

/**
 * Show the current Listing
 */
exports.read = function (req) {
	return req.listing;
};

/**
 * Update a Listing
 */
exports.update = function (req) {
	var listing = req.listing;
	listing = _.extend(listing, req.body);
	return listing.savePromise();
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
	return Listing.find().sort('-created').populate('user', 'displayName').exec();
};

/**
 * Listing middleware
 */
exports.listingByID = function (req, id) {
	return Listing.findById(id).populate('user', 'displayName').exec();
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
