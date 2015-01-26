'use strict';

angular.module('core').service('Random', [
	function() {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
		this.generateString = function(length) {
			length = length ? length : 32;
			var string = '';
			for (var i = 0; i < length; i++) {
				var randomNumber = Math.floor(Math.random() * chars.length);
				string += chars.substring(randomNumber, randomNumber + 1);
			}
			return string;
		};
	}
]);
