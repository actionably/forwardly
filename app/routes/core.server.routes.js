'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	var pH = require('../utils/promiseHandler');

	app.route('/').get(core.index);
	app.route('/sign_s3').get(pH.jsonp(core.sign_s3));
};
