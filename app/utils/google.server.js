'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
	OAuth2 = require('oauth').OAuth2,
	config = require('../../config/config'),
	_ = require('lodash');

exports.get = function (url, userOrToken) {
	var accessToken = (typeof userOrToken === 'string' ? userOrToken : userOrToken.additionalProvidersData.google.accessToken);
	var oauth2 = new OAuth2(config.google.clientID, config.google.clientSecret);
	return Q.Promise(function (resolve, reject) {
		oauth2.get(url, accessToken,
			function(error, data) {
				if (error) {
					reject(error);
					return;
				}
				resolve(JSON.parse(data));
			});
	});
};
