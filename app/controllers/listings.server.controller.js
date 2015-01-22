'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Listing = mongoose.model('Listing'),
	_ = require('lodash');

/**
 * Create a Listing
 */
exports.create = function(req, res) {
	var listing = new Listing(req.body);
	listing.user = req.user;

	listing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(listing);
		}
	});
};

/**
 * Show the current Listing
 */
exports.read = function(req, res) {
	res.jsonp(req.listing);
};

/**
 * Update a Listing
 */
exports.update = function(req, res) {
	var listing = req.listing ;

	listing = _.extend(listing , req.body);

	listing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(listing);
		}
	});
};

/**
 * Delete an Listing
 */
exports.delete = function(req, res) {
	var listing = req.listing ;

	listing.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(listing);
		}
	});
};

/**
 * List of Listings
 */
exports.list = function(req, res) { Listing.find().sort('-created').populate('user', 'displayName').exec(function(err, listings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(listings);
		}
	});
};

/**
 * Listing middleware
 */
exports.listingByID = function(req, res, next, id) { Listing.findById(id).populate('user', 'displayName').exec(function(err, listing) {
		if (err) return next(err);
		if (! listing) return next(new Error('Failed to load Listing ' + id));
		req.listing = listing ;
		next();
	});
};

/**
 * Listing authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.listing.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};