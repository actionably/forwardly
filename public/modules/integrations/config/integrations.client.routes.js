'use strict';

//Setting up route
angular.module('integrations').config(['$stateProvider',
	function ($stateProvider) {
		// Listings state routing
		$stateProvider
			.state('linkedInFriends', {
				url: '/linkedin/friends',
				templateUrl: 'modules/integrations/views/linkedin.friends.client.view.html',
				controller:'LinkedInFriendsController'
			})
			.state('googleContacts', {
				url: '/google/contacts',
				templateUrl: 'modules/integrations/views/google.contacts.client.view.html',
				controller:'GoogleContactsController'
			});
	}
]);
