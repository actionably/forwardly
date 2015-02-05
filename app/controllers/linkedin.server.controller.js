'use strict';

/**
 * Module dependencies.
 */
var
	LinkedIn = require('../utils/linkedin'),
	_ = require('lodash');

var ALL_FIELDS = '(id,first-name,last-name,headline,location:(name,country:(code)),industry,distance,' +
	'relation-to-viewer:(distance),current-share,num-connections,num-connections-capped,summary,specialties,' +
	'positions:(id,title,summary,start-date,end-date,is-current,company:(id,name,type,industry,ticker)),' +
	'picture-url,public-profile-url)';

exports.friends = function (req) {
	var user = req.user;
	return LinkedIn.get('/people/~/connections:'+ALL_FIELDS, user).then(function (data) {
		return _.filter(data.values, function(person) { return person.id!=='private'; });
	});
};
