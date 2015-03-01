/* globals S3Upload */
'use strict';

// Submissions controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location',
	'Authentication', 'Contacts',
	function($scope, $stateParams, $location, Authentication, Contacts) {
		$scope.authentication = Authentication;
		$scope.contacts = Contacts.query();
	}
]);
