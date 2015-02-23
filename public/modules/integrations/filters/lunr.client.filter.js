/* global _,lunr */
'use strict';


angular.module('integrations').filter('lunrFilter', [
	function() {
		return function (items, text, index) {
			if (!text) {
				return items;
			}
			var results = index.search(text);
			var mapResults = _.map(results, function(result) {
				var item = _.findWhere(items, {id: result.ref});
				item.score = result.score;
				return item;
			});
			return mapResults;
		};
	}
]);
