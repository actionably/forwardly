'use strict';

//Setting up route
angular.module('submissions').config(['$stateProvider',
	function($stateProvider) {
		// Submissions state routing
		$stateProvider.
		state('listSubmissions', {
			url: '/submissions',
			templateUrl: 'modules/submissions/views/list-submissions.client.view.html'
		}).
		state('createSubmissionFromReferral', {
			url: '/submissions/create/referral/:referralId',
			templateUrl: 'modules/submissions/views/create-submission.client.view.html'
		}).
		state('createSubmissionFromListing', {
			url: '/submissions/create/listing/:listingId',
			templateUrl: 'modules/submissions/views/create-submission.client.view.html'
		}).
		state('viewSubmission', {
			url: '/submissions/:submissionId',
			templateUrl: 'modules/submissions/views/view-submission.client.view.html'
		});
	}
]);
