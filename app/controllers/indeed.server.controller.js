'use strict';

/**
 * Module dependencies.
 */

exports.search = function (req) {
	var user = req.user;
	var search_term = req.query.q ? req.query.q : '';
	console.log('search_term', req.query, search_term);
	var url = 'http://api.indeed.com/ads/apisearch?publisher=4266633121589556&q=' +encodeURIComponent(search_term)+ '&l=san+francisco%2C+ca&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json';
	var rp = require('request-promise');
	 
	return rp(url)
	    .then(function (response) {
	    	//console.log('hi', response);
	    	return response;
	    })
	    .catch(console.error);
};
