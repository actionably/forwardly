'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var linkedin = require('../../app/controllers/linkedin');
	var pH = require('../utils/promiseHandler');

    // Referrals Routes
	app.route('/linkedin/friends')
		.get(users.requiresLinkedin, pH.jsonp(linkedin.friends));

};
