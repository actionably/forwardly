'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var integrations = require('../../app/controllers/integrations');
	var pH = require('../utils/promiseHandler');

    // Referrals Routes
	app.route('/linkedin/friends')
		.get(users.requiresIntegration('linkedin'), pH.jsonp(integrations.linkedin_friends));

	app.route('/google/contacts')
		.get(users.requiresIntegration('google'), pH.jsonp(integrations.google_contacts));

};
