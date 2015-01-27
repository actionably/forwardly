'use strict';

// Listings controller
angular.module('listings').controller('ListingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Listings', 'Companies', 'Referrals',
	function($scope, $stateParams, $location, Authentication, Listings, Companies, Referrals ) {
		$scope.authentication = Authentication;

		// Create new Listing
		$scope.create = function() {
			// Create new Listing object
			console.log(this);
			var listing = new Listings ({
				company: this.company,
				headline: this.headline,
				description: this.description,
				location: this.location,
				role: this.role,
				tags: this.tags,
				referralFee: this.referralFee
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
			if ($stateParams.referralId) {
				console.log('the referralId is', $stateParams.referralId);
				$scope.referral = Referrals.get({
					referralId: $stateParams.referralId
				});
			}

		};

		// the list of roles
		$scope.roles = [
			{name: 'Software Engineer'},
			{name: 'Backend Developer'},
			{name: 'Data Scientist'}, 
			{name: 'DevOps'}, 
			{name: 'Frontend Developer'}, 
			{name: 'Full-Stack Developer'}, 
			{name: 'Mobile Developer'}, 
			{name: 'Attorney'}, 
			{name: 'UI/UX Designer'}, 
			{name: 'Finance/Accounting'}, 
			{name: 'Hardware Engineer'}, 
			{name: 'H.R.'}, 
			{name: 'Marketing'}, 
			{name: 'Office Manager'}, 
			{name: 'Operations'}, 
			{name: 'Product Manager'}, 
			{name: 'Sales' }
		];

		// the list of companies
		$scope.companies = Companies.query();	
		
	}
]);