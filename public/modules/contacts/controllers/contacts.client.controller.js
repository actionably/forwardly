/* globals S3Upload,_ */
'use strict';

angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location',
	'Authentication', 'Contacts',
	function($scope, $stateParams, $location, Authentication, Contacts) {
		$scope.authentication = Authentication;
		$scope.data = {
			jobsOnly: false
		};
		Contacts.query().$promise.then(function (contacts) {
			_.forEach(contacts, function(contact) {
				if (contact.pipl) {
					var dataRest = _.cloneDeep(contact.pipl.data);
					//delete stuff we don't care about
					delete dataRest['@http_status_code'];
					delete dataRest['@visible_sources'];
					delete dataRest['@available_sources'];
					delete dataRest['@search_id'];
					delete dataRest.query;
					if (dataRest.person) {
						//delete stuff we don't care about
						delete dataRest.person['@id'];
						delete dataRest.person['@match'];
						delete dataRest.person.emails;
						delete dataRest.person.user_ids;

						//delete stuff we already show
						delete dataRest.person.gender;
						delete dataRest.person.dob;
						delete dataRest.person.names;
						delete dataRest.person.usernames;
						delete dataRest.person.phones;
						delete dataRest.person.addresses;
						delete dataRest.person.jobs;
						delete dataRest.person.educations;
						delete dataRest.person.relationships;
						delete dataRest.person.images;
						delete dataRest.person.urls;

						if (Object.keys(dataRest.person).length === 0) {
							delete dataRest.person;
						}
					}
					// sort of show.
					delete dataRest.possible_persons;
					if (Object.keys(dataRest).length !== 0) {
						contact.pipl.dataRest = dataRest;
					}
				}
			});
			$scope.contacts = contacts;
		});
	}
]);
