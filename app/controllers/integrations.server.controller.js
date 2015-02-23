'use strict';

/**
 * Module dependencies.
 */
var
	LinkedIn = require('../utils/linkedin'),
	Google = require('../utils/google'),
	_ = require('lodash');

var LINKEDIN_ALL_FIELDS = '(id,first-name,last-name,headline,location:(name,country:(code)),industry,distance,' +
	'relation-to-viewer:(distance),current-share,num-connections,num-connections-capped,summary,specialties,' +
	'positions:(id,title,summary,start-date,end-date,is-current,company:(id,name,type,industry,ticker)),' +
	'picture-url,public-profile-url)';

exports.linkedin_friends = function (req) {
	var user = req.user;
	return LinkedIn.get('/people/~/connections:'+LINKEDIN_ALL_FIELDS, user).then(function (data) {
		return _.filter(data.values, function(person) { return person.id!=='private'; });
	});
};

exports.google_contacts = function (req) {
	var user = req.user;
	return Google.get('/feeds/contacts/default/full?alt=json&max-results=2000', user).then(function(data) {
		return _.map(data.feed.entry, function(entry) {
			return {
				name: entry.title.$t,
				emails: _.pluck(entry.gd$email, 'address')
			};
		});
	});
};
