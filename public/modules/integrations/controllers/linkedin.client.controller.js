/* global _,lunr */
'use strict';

angular.module('integrations').controller('LinkedInFriendsController', ['$scope', '$state', '$stateParams', '$location', '$resource', 'Authentication',
	function($scope, $state, $stateParams, $location, $resource, Authentication) {
		$scope.authentication = Authentication;
		$resource('linkedin/friends').query().$promise.then(function(friends) {
			$scope.friends = friends;
			var index = lunr(function() {
				this.field('name');
				this.field('headline', {boost: 5});
				this.field('locationName');
				for(var i = 0; i < 10; i++) {
					this.field('position'+i+'CompanyName');
					this.field('position'+i+'Summary');
					this.field('position'+i+'Title');
				}
			});
			_.forEach(friends, function(item) {
				item.name = item.firstName + ' ' + item.lastName;
				item.locationName = item.location.name;
				_.forEach(item.positions.values, function(position, index) {
					item['position'+index+'CompanyName'] = position.company.name;
					item['position'+index+'Summary'] = position.summary;
					item['position'+index+'Title'] = position.title;
				});
				index.add(item);
			});
			$scope.friendIndex = index;
		});
	}
]);
