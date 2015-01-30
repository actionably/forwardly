'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Random',
	function($scope, Authentication, Random) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
