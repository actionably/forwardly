'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var companies = require('../../app/controllers/companies');
	var pH = require('../utils/promiseHandler');

	// Companies Routes
	app.route('/companies')
		.get(pH.jsonp(companies.list))
		.post(users.requiresLogin, pH.jsonp(companies.create));

	app.route('/companies/:companyId')
		.get(pH.jsonp(companies.read))
		.put(users.requiresLogin, companies.hasAuthorization, pH.jsonp(companies.update))
		.delete(users.requiresLogin, companies.hasAuthorization, pH.jsonp(companies.delete));

	// Finish by binding the Company middleware
	app.param('companyId', pH.param(companies.companyByID, 'company'));
};
