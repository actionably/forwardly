'use strict';

module.exports = function(app) {
	var mongooseControllers = require('../../app/controllers/mongoose');

	// Companies Routes
	app.route('/mongoose')
		.get(mongooseControllers.list);

	app.route('/mongoose/:modelName')
		.get(mongooseControllers.read);

};
