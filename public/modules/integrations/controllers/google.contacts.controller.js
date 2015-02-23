/* global _,lunr */
'use strict';

angular.module('integrations').controller('GoogleContactsController', ['$scope', '$state', '$stateParams', '$location', '$resource', 'Authentication',
	function($scope, $state, $stateParams, $location, $resource, Authentication) {
		$scope.authentication = Authentication;
		$scope.contacts = $resource('google/contacts').query();
	}
]);
