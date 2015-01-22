'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var listings = require('../../app/controllers/listings');

	// Listings Routes
	app.route('/listings')
		.get(listings.list)
		.post(users.requiresLogin, listings.create);

	app.route('/listings/:listingId')
		.get(listings.read)
		.put(users.requiresLogin, listings.hasAuthorization, listings.update)
		.delete(users.requiresLogin, listings.hasAuthorization, listings.delete);

	// Finish by binding the Listing middleware
	app.param('listingId', listings.listingByID);
};