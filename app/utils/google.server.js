'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
	OAuth2 = require('oauth').OAuth2,
	config = require('../../config/config'),
	_ = require('lodash');

exports.get = function (partialUrl, user) {
	var accessToken = user.additionalProvidersData.google.accessToken;
	var oauth2 = new OAuth2(config.google.clientID, config.google.clientSecret);
	return Q.Promise(function (resolve, reject) {
		oauth2.get('https://www.google.com/m8'+partialUrl, accessToken,
			function(error, data) {
				if (error) {
					reject(error);
					return;
				}
				resolve(JSON.parse(data));
			});
	});
};
