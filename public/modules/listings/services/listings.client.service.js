'use strict';

//Listings service used to communicate Listings REST endpoints
angular.module('listings').factory('Listings', ['$resource',
	function($resource) {
		return $resource('listings/:listingId', { listingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);