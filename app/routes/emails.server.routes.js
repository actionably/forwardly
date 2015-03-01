'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var emails = require('../../app/controllers/emails');
	var pH = require('../utils/promiseHandler');
	var bodyParser = require('body-parser');

	app.route('/contacts')
		.get(users.requiresLogin, pH.jsonp(emails.listContacts));

	app.route('/emails/downloadAll')
		.get(users.requiresLogin, pH.jsonp(emails.downloadAll));

	app.route('/emails/extractAllContacts')
		.get(users.requiresLogin, pH.jsonp(emails.extractAllContacts));

	app.route('/emails/addFullContactToAll')
		.get(users.requiresLogin, pH.jsonp(emails.addFullContactToAll));

	// worker queue entry points.

	// this should go somewhere else
	app.route('/worker/processDbItems')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.workerProcessDbItems));

	app.route('/emails/extractContacts')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.workerExtractContacts));

	app.route('/emails/addFullContact')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.workerAddFullContact));

	app.route('/emails/downloadList')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.workerDownloadList));

	app.route('/emails/downloadOne')
		.post(bodyParser.json({type:'text/plain'}), pH.jsonp(emails.workerDownloadOne));

};
