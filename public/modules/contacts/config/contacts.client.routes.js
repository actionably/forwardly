'use strict';

angular.module('contacts').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
			state('listContacts', {
				url: '/contacts',
				templateUrl: 'modules/contacts/views/list-contacts.client.view.html',
				controller: 'ContactsController'
			});
	}
]);
