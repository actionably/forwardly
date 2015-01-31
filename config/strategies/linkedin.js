'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			clientID: config.linkedin.clientID,
			clientSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			profileFields: ['id', 'first-name', 'last-name', 'email-address'],
			scope: ['w_messages', 'r_network', 'r_emailaddress', 'r_fullprofile', 'r_contactinfo'],
			state:true,
			passReqToCallback:true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'linkedin',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
			}
	));
};
