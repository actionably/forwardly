'use strict';

// Listings controller
angular.module('listings').controller('ListingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Listings',
	function($scope, $stateParams, $location, Authentication, Listings ) {
		$scope.authentication = Authentication;

		// Create new Listing
		$scope.create = function() {
			// Create new Listing object
			var listing = new Listings ({
				name: this.name
			});

			// Redirect after save
			listing.$save(function(response) {
				$location.path('listings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Listing
		$scope.remove = function( listing ) {
			if ( listing ) { listing.$remove();

				for (var i in $scope.listings ) {
					if ($scope.listings [i] === listing ) {
						$scope.listings.splice(i, 1);
					}
				}
			} else {
				$scope.listing.$remove(function() {
					$location.path('listings');
				});
			}
		};

		// Update existing Listing
		$scope.update = function() {
			var listing = $scope.listing ;

			listing.$update(function() {
				$location.path('listings/' + listing._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Listings
		$scope.find = function() {
			$scope.listings = Listings.query();
		};

		// Find existing Listing
		$scope.findOne = function() {
			$scope.listing = Listings.get({ 
				listingId: $stateParams.listingId
			});
		};
	}
]);