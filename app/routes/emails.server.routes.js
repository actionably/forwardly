'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var emails = require('../../app/controllers/emails');
	var pH = require('../utils/promiseHandler');
	var bodyParser = require('body-parser');

	app.route('/emails/downloadAll')
		.get(users.requiresLogin, pH.jsonp(emails.downloadAll));

	// worker queue entry points.
	app.route('/emails/downloadList')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.downloadList));

	app.route('/emails/downloadOne')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.downloadOne));

};
