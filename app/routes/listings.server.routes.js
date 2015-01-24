'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var listings = require('../../app/controllers/listings');
	var pH = require('../utils/promiseHandler');

	// Listings Routes
	app.route('/listings')
		.get(pH.jsonp(listings.list))
		.post(users.requiresLogin, pH.jsonp(listings.create));

	app.route('/listings/:listingId')
		.get(pH.jsonp(listings.read))
		.put(users.requiresLogin, listings.hasAuthorization, pH.jsonp(listings.update))
		.delete(users.requiresLogin, listings.hasAuthorization, pH.jsonp(listings.delete));

	// Finish by binding the Listing middleware
	app.param('listingId', pH.param(listings.listingByID, 'listing'));
};
