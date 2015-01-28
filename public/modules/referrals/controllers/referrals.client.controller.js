'use strict';

// Referrals controller
angular.module('referrals').controller('ReferralsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Referrals',
	function($scope, $stateParams, $location, Authentication, Referrals ) {
		$scope.authentication = Authentication;

		// Create new Referral
		$scope.create = function() {
			// Create new Referral object
			var referral = new Referrals ({
				listing: $stateParams.listingId,
                parentReferral: $stateParams.referralId,
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName,
                customMessage: this.customMessage
			});

			// Redirect after save
			referral.$save(function(response) {
				// with the response, we redirect back to the listing with the parent referral
				console.log('Referral Created: ', response._id);
				var destination = 'listings/' + response.listing._id;
				destination += response.parentReferral ? '/referrals/' + response.parentReferral._id : '';
				// TODO: Put a success flash message here
				$location.path(destination);
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Referral
		$scope.remove = function( referral ) {
			if ( referral ) { referral.$remove();

				for (var i in $scope.referrals ) {
					if ($scope.referrals [i] === referral ) {
						$scope.referrals.splice(i, 1);
					}
				}
			} else {
				$scope.referral.$remove(function() {
					$location.path('referrals');
				});
			}
		};

		// Update existing Referral
		$scope.update = function() {
			var referral = $scope.referral ;

			referral.$update(function() {
				$location.path('referrals/' + referral._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Referrals
		$scope.find = function() {
			$scope.referrals = Referrals.query();
		};

		// Find existing Referral
		$scope.findOne = function() {
			$scope.referral = Referrals.get({ 
				referralId: $stateParams.referralId
			});
		};
	}
]);
