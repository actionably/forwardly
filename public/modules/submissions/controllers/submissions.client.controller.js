'use strict';

// Submissions controller
angular.module('submissions').controller('SubmissionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Submissions',
	'Referrals',
	function($scope, $stateParams, $location, Authentication, Submissions, Referrals ) {
		$scope.authentication = Authentication;

		// Create new Submission
		$scope.create = function() {
			// Create new Submission object
			var submission = new Submissions ({
				listing: this.referral.listing._id,
				referral: this.referral._id,
				email: this.email,
				firstName: this.firstName,
				lastName: this.lastName,
				linkedInUrl: this.linkedInUrl,
				uploadedResumeUrl: this.uploadedResumeUrl
			});

			// Redirect after save
			submission.$save(function(response) {
				$location.path('submissions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Submission
		$scope.remove = function( submission ) {
			if ( submission ) { submission.$remove();

				for (var i in $scope.submissions ) {
					if ($scope.submissions [i] === submission ) {
						$scope.submissions.splice(i, 1);
					}
				}
			} else {
				$scope.submission.$remove(function() {
					$location.path('submissions');
				});
			}
		};

		// Update existing Submission
		$scope.update = function() {
			var submission = $scope.submission ;

			submission.$update(function() {
				$location.path('submissions/' + submission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Submissions
		$scope.find = function() {
			$scope.submissions = Submissions.query();
		};

		// Find existing Submission
		$scope.findOne = function() {
			$scope.submission = Submissions.get({
				submissionId: $stateParams.submissionId
			});
		};
		$scope.findReferral = function() {
			$scope.referral = Referrals.get({
				submissionId: $stateParams.referralId
			});
		};
	}
]);
