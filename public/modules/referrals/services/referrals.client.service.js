'use strict';

//Referrals service used to communicate Referrals REST endpoints
angular.module('referrals').factory('Referrals', ['$resource',
	function($resource) {
		return $resource('referrals/:referralId', { referralId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);