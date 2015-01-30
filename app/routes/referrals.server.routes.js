'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var referrals = require('../../app/controllers/referrals');
	var pH = require('../utils/promiseHandler');

    // Referrals Routes
	app.route('/referrals')
		.get(pH.jsonp(referrals.list))
		.post(users.requiresLogin, pH.jsonp(referrals.create));

	app.route('/referrals/:referralId')
		.get(pH.jsonp(referrals.read))
		.put(users.requiresLogin, pH.jsonp(referrals.update))
		.delete(users.requiresLogin, pH.jsonp(referrals.delete));

	// Finish by binding the Referral middleware
	app.param('referralId', pH.param(referrals.referralByID, 'referral'));

};
