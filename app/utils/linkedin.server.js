'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
	OAuth2 = require('oauth').OAuth2,
	config = require('../../config/config'),
	_ = require('lodash');

exports.get = function (partialUrl, user) {
	var accessToken = user.additionalProvidersData.linkedin.accessToken;
	var oauth2 = new OAuth2(config.linkedin.clientID, config.linkedin.clientSecret, null, null, null,
		{'x-li-format':'json'}
	);
	oauth2.setAccessTokenName('oauth2_access_token');
	return Q.Promise(function (resolve, reject) {
		oauth2.get('https://api.linkedin.com/v1'+partialUrl, accessToken,
			function(error, data) {
				if (error) {
					reject(error);
					return;
				}
				resolve(JSON.parse(data));
			});
	});
};
