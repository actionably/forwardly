'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var listings = require('../../app/controllers/listings');
	var referrals = require('../../app/controllers/referrals');
	var submissions = require('../../app/controllers/submissions');
	var pH = require('../utils/promiseHandler');

	// Listings Routes
	app.route('/listings')
		.get(pH.jsonp(listings.list))
		.post(users.requiresLogin, pH.jsonp(listings.create));

	app.route('/listings/:listingId')
		.get(pH.jsonp(listings.read))
		.put(users.requiresLogin, listings.hasAuthorization, pH.jsonp(listings.update))
		.delete(users.requiresLogin, listings.hasAuthorization, pH.jsonp(listings.delete));

	app.route('/listings/:listingId/referrals')
		.get(pH.jsonp(referrals.list))
		.post(users.requiresLogin, pH.jsonp(referrals.create));

	app.route('/listings/:listingId/referrals/:referralId')
		.get(pH.jsonp(referrals.read))
		.put(users.requiresLogin, listings.hasAuthorization, pH.jsonp(referrals.update))
		.delete(users.requiresLogin, listings.hasAuthorization, pH.jsonp(referrals.delete));

	app.route('/listings/:listingId/submissions')
		.get(pH.jsonp(submissions.list))
		.post(users.requiresLogin, pH.jsonp(submissions.create));

	app.route('/listings/:listingId/submissions/:submissionId')
		.get(pH.jsonp(submissions.read))
		.put(users.requiresLogin, listings.hasAuthorization, pH.jsonp(submissions.update))
		.delete(users.requiresLogin, listings.hasAuthorization, pH.jsonp(submissions.delete));

	// Finish by binding the Listing middleware
	app.param('listingId', pH.param(listings.listingByID, 'listing'));
	app.param('referralId', pH.param(referrals.referralByID, 'referral'));
	app.param('submissionId', pH.param(submissions.submissionByID, 'submission'));
};
