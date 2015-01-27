'use strict';

(function() {
	// Referrals Controller Spec
	describe('Referrals Controller Tests', function() {
		// Initialize global variables
		var ReferralsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Referrals controller.
			ReferralsController = $controller('ReferralsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Referral object fetched from XHR', inject(function(Referrals) {
			// Create sample Referral using the Referrals service
			var sampleReferral = new Referrals({
				name: 'New Referral'
			});

			// Create a sample Referrals array that includes the new Referral
			var sampleReferrals = [sampleReferral];

			// Set GET response
			$httpBackend.expectGET('referrals').respond(sampleReferrals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.referrals).toEqualData(sampleReferrals);
		}));

		it('$scope.findOne() should create an array with one Referral object fetched from XHR using a referralId URL parameter', inject(function(Referrals) {
			// Define a sample Referral object
			var sampleReferral = new Referrals({
				name: 'New Referral'
			});

			// Set the URL parameter
			$stateParams.referralId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/referrals\/([0-9a-fA-F]{24})$/).respond(sampleReferral);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.referral).toEqualData(sampleReferral);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Referrals) {
			// Create a sample Referral object
			var sampleReferralPostData = new Referrals({
				name: 'New Referral'
			});

			// Create a sample Referral response
			var sampleReferralResponse = new Referrals({
				_id: '525cf20451979dea2c000001',
				name: 'New Referral'
			});

			// Fixture mock form input values
			scope.name = 'New Referral';

			// Set POST response
			$httpBackend.expectPOST('referrals', sampleReferralPostData).respond(sampleReferralResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Referral was created
			expect($location.path()).toBe('/referrals/' + sampleReferralResponse._id);
		}));

		it('$scope.update() should update a valid Referral', inject(function(Referrals) {
			// Define a sample Referral put data
			var sampleReferralPutData = new Referrals({
				_id: '525cf20451979dea2c000001',
				name: 'New Referral'
			});

			// Mock Referral in scope
			scope.referral = sampleReferralPutData;

			// Set PUT response
			$httpBackend.expectPUT(/referrals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/referrals/' + sampleReferralPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid referralId and remove the Referral from the scope', inject(function(Referrals) {
			// Create new Referral object
			var sampleReferral = new Referrals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Referrals array and include the Referral
			scope.referrals = [sampleReferral];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/referrals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReferral);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.referrals.length).toBe(0);
		}));
	});
}());