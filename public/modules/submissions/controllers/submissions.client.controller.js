/* globals S3Upload */
'use strict';

// Submissions controller
angular.module('submissions').controller('SubmissionsController', ['$scope', '$stateParams', '$location',
	'Authentication', 'Submissions', 'Referrals', 'Listings', 'Random',
	function($scope, $stateParams, $location, Authentication, Submissions, Referrals, Listings, Random ) {
		$scope.authentication = Authentication;

		$scope.initCreate = function() {
			if ($stateParams.referralId) {
				Referrals.get({
					referralId: $stateParams.referralId
				}).$promise.then(function(referral) {
						$scope.referral = referral;
						$scope.listing = referral.listing;
					});
			} else {
				$scope.listing = Listings.get({
					listingId: $stateParams.listingId
				});
			}
		};

		$scope.create = function() {
			var data = {
				listing: $scope.listing._id,
				email: this.email,
				firstName: this.firstName,
				lastName: this.lastName
			};
			if (!this.linkedInUrl && !$scope.upload.url) {
				$scope.errorLinkedInOrUpload = true;
				return;
			}
			if (this.linkedInUrl) {
				data.linkedInUrl = this.linkedInUrl;
			}
			if ($scope.upload.url) {
				data.uploadedResumeUrl = $scope.upload.url;
			}
			if ($scope.referral) {
				data.referral = $scope.referral._id;
			}
			console.log(JSON.stringify(data, null, ' '));
			var submission = new Submissions (data);
			// Redirect after save
			submission.$save(function(response) {
				$location.path('submissions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.upload = {
			progressing: false,
			percent:0,
			complete:false,
			url:'',
			error:false,
			errorMessage:''
		};
		$scope.s3_upload = function(target) {
			$scope.upload = {
				progressing: false,
				percent:0,
				complete:false,
				url:'',
				error:false,
				errorMessage:''
			};
			var namePrefix = $scope.firstName+$scope.lastName;
			if (!namePrefix) {
				namePrefix = 'Candidate';
			}
			if (!target.files[0] || !target.files[0].type) {
				$scope.$apply(function() {
					$scope.upload.error = true;
					$scope.upload.errorMessage = 'Unable to read content type of resume';
				});
				return;
			}
			var type = target.files[0].type;
			var suffix = '';
			if (type === 'application/pdf') {
				suffix = '.pdf';
			} else if (type === 'application/msword') {
				suffix = '.doc';
			} else if (type === 'application/rtf') {
				suffix = '.rtf';
			} else if (type === 'text/plain') {
				suffix = '.txt';
			} else {
				$scope.$apply(function() {
					$scope.upload.error = true;
					$scope.upload.errorMessage = 'Resume must be pdf, doc, rtf, or txt file';
				});
				return;
			}
			var name = Random.generateString(24)+'/'+namePrefix+'Resume'+suffix;
			var s3upload = new S3Upload({
				s3_object_name: name,
				file_dom_selector: 'files',
				s3_sign_put_url: '/sign_s3',
				onProgress: function(percent, message) {
					$scope.$apply(function() {
						$scope.upload.progressing = true;
						$scope.upload.percent = percent;
					});
				},
				onFinishS3Put: function(public_url) {
					$scope.$apply(function() {
						$scope.upload.progressing = false;
						$scope.upload.complete = true;
						$scope.upload.url = public_url;
					});
				},
				onError: function(status) {
					$scope.$apply(function() {
						$scope.upload.progressing = false;
						$scope.upload.complete = false;
						$scope.upload.error = true;
						$scope.upload.errorMessage = status;
					});
				}
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
	}
]);
