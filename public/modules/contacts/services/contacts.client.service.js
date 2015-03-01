'use strict';

//Submissions service used to communicate Submissions REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('contacts');
	}
]);
