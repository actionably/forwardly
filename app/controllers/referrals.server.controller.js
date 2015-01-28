'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Referral = mongoose.model('Referral'),
	config = require('../../config/config'),
	mandrill = require('mandrill-api/mandrill'),
	moment = require('moment'),
	swig = require('swig'),
	Q = require('q'),
	_ = require('lodash');

var bodyReferralTemplate = swig.compileFile('./app/views/templates/referral-body-email.server.view.html');
var subjectReferralTemplate = swig.compileFile('./app/views/templates/referral-subject-email.server.view.txt');

function sendReferralEmail(referral, data) {
	var mandrill_client = new mandrill.Mandrill(config.mandrill.apiKey);
	var html = bodyReferralTemplate(data);
	var subject = subjectReferralTemplate(data);
	var message = {
		'html': html,
		'subject': subject,
		'from_email': 'jobs@actionably.com',
		'from_name': 'Jobs',
		'to': [{
			'email': referral.email,
			'name': referral.fullName(),
			'type': 'to'
		}],
		'headers': {
			'Reply-To': 'jobs@actionably.com'
		}
	};
	var async = false;
	var ip_pool = 'Main Pool';
	return Q.Promise(function (resolve, reject) {
		mandrill_client.messages.send({'message': message, 'async': async, 'ip_pool': ip_pool},
			function(result) {
				resolve(referral);
			}, function(e) {
				// Mandrill returns the error as an object with name and message keys
				console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
				// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
				reject(e);
			}
		);
	});
}

function referralByID(id) {
	return Referral.findById(id).populate('listing').populate('parentReferral').exec();
}


/**
 * Create a Referral
 */
exports.create = function (req) {
	var referral = new Referral(req.body);
	return referral.savePromise().then(function(referral) {
		return referralByID(referral.id).then(function(fullReferral) {
			return sendReferralEmail(fullReferral, {
				referral : fullReferral,
				host : req.headers.host
			});
		});
	});
};

/**
 * Show the current Referral
 */
exports.read = function (req) {
	return req.referral;
};

/**
 * Update a Referral
 */
exports.update = function (req) {
	var referral = req.referral;
	referral = _.extend(referral, req.body);
	return referral.savePromise();
};

/**
 * Delete an Referral
 */
exports.delete = function (req) {
	var referral = req.referral;
	return referral.removePromise();
};

/**
 * List of Referrals
 */
exports.list = function (req) {
	return Referral.find().sort('-created').exec();
};

/**
 * Referral middleware
 */
exports.referralByID = function (req, id) {
	return referralByID(id);
};

