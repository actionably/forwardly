'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * List of Listings
 */
exports.list = function(req, res) {
	console.log(JSON.stringify(mongoose.modelNames()));
	res.jsonp(mongoose.modelNames());
};

exports.read = function(req, res) {
	res.jsonp(mongoose.model(req.param('modelName')).schema);
};
