'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Company = mongoose.model('Company'),
	_ = require('lodash');

/**
 * Create a Company
 */
exports.create = function (req) {
	var company = new Company(req.body);
	return company.savePromise();
};

/**
 * Show the current Company
 */
exports.read = function (req) {
	return req.company;
};

/**
 * Update a Company
 */
exports.update = function (req) {
	var company = req.company;
	company = _.extend(company, req.body);
	return company.savePromise();
};

/**
 * Delete an Company
 */
exports.delete = function (req) {
	var company = req.company;
	return company.removePromise();
};

/**
 * List of Companies
 */
exports.list = function (req) {
	return Company.find().sort('-created').exec();
};

/**
 * Company middleware
 */
exports.companyByID = function (req, id) {
	return Company.findById(id).exec();
};

/**
 * Company authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	next();
};
