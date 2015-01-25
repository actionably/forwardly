'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Submission = mongoose.model('Submission'),
	_ = require('lodash');

/**
 * Create a Submission
 */
exports.create = function (req) {
	var listing = req.listing;
	var submission = new Submission(req.body);
	submission.listing = listing;
	return submission.savePromise();
};

/**
 * Show the current Submission
 */
exports.read = function (req) {
	return req.submission;
};

/**
 * Update a Submission
 */
exports.update = function (req) {
	var submission = req.submission;
	submission = _.extend(submission, req.body);
	return submission.savePromise();
};

/**
 * Delete an Submission
 */
exports.delete = function (req) {
	var submission = req.submission;
	return submission.removePromise();
};

/**
 * List of Submissions
 */
exports.list = function (req) {
	return Submission.find({listing:req.listing}).sort('-created').exec();
};

/**
 * Submission middleware
 */
exports.submissionByID = function (req, id) {
	return Submission.findById(id).exec();
};

