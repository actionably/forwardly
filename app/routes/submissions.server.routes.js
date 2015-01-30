'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var submissions = require('../../app/controllers/submissions');
	var pH = require('../utils/promiseHandler');

	// Submissions Routes
	app.route('/submissions')
		.get(pH.jsonp(submissions.list))
		.post(users.requiresLogin, pH.jsonp(submissions.create));

	app.route('/submissions/:submissionId')
		.get(pH.jsonp(submissions.read))
		.delete(users.requiresLogin, pH.jsonp(submissions.delete));

	// Finish by binding the Submission middleware
	app.param('submissionId', pH.param(submissions.submissionByID, 'submission'));
};
