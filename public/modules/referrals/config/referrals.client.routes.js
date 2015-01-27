'use strict';

//Setting up route
angular.module('referrals').config(['$stateProvider',
	function($stateProvider) {
		// Referrals state routing
		$stateProvider.
		state('listReferrals', {
			url: '/referrals',
			templateUrl: 'modules/referrals/views/list-referrals.client.view.html'
		}).
        state('createReferral', {
            url: '/referrals/create/:listingId',
            templateUrl: 'modules/referrals/views/create-referral.client.view.html'
        }).
		state('createReferral2', {
			url: '/referrals/create/:listingId/:referralId',
			templateUrl: 'modules/referrals/views/create-referral.client.view.html'
		}).
		state('viewReferral', {
			url: '/referrals/:referralId',
			templateUrl: 'modules/referrals/views/view-referral.client.view.html'
		}).
		state('editReferral', {
			url: '/referrals/:referralId/edit',
			templateUrl: 'modules/referrals/views/edit-referral.client.view.html'
		});
	}
]);
