'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var indeed = require('../../app/controllers/indeed');
	var pH = require('../utils/promiseHandler');

    // Referrals Routes
	app.route('/indeed/search')
		.get(pH.jsonp(indeed.search));
};
