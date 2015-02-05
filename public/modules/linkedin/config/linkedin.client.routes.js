'use strict';

//Setting up route
angular.module('linkedin').config(['$stateProvider',
	function ($stateProvider) {
		// Listings state routing
		$stateProvider.
			state('linkedInFriends', {
				url: '/linkedin/friends',
				templateUrl: 'modules/linkedin/views/linkedin.friends.client.view.html',
				controller:'LinkedInFriendsController'
			});
	}
]);
