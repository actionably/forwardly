'use strict';

// Listings controller
angular.module('linkedin').controller('LinkedInFriendsController', ['$scope', '$state', '$stateParams', '$location', '$resource', 'Authentication',
	function($scope, $state, $stateParams, $location, $resource, Authentication) {
		$scope.authentication = Authentication;
		$scope.friends = $resource('linkedin/friends').query();
	}
]);
