/* globals S3Upload */
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Random',
	function($scope, Authentication, Random) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.data = {
			firstName : '',
			lastName : ''
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
			console.log('got here');
			var namePrefix = $scope.data.firstName+$scope.data.lastName;
			if (!namePrefix) {
				namePrefix = 'Candidate';
			}
			console.log('got here2');
			if (!target.files[0] || !target.files[0].type) {
				$scope.$apply(function() {
					$scope.upload.error = true;
					$scope.upload.errorMessage = 'Unable to read content type of resume';
				});
				return;
			}
			console.log('got here3');
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
			console.log('got here4 '+name);
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
	}
]);
