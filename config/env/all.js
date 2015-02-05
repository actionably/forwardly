'use strict';

module.exports = {
	app: {
		title: 'Forwardly',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	amazonAWS: {
		clientID: process.env.AMAZONAWS_ID || 'APP_ID',
		clientSecret: process.env.AMAZONAWS_SECRET || 'APP_SECRET',
		s3Bucket: process.env.AMAZONAWS_S3_BUCKET || 'forwardly.dev.uploads'
	},
	mandrill: {
		apiKey: process.env.MANDRILL_APIKEY || 'API_KEY',
		username: process.env.MANDRILL_USERNAME || 'USERNAME'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/dist/style.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/s3upload/s3upload.js',
				'public/lib/textAngular/dist/textAngular-rangy.min.js',
				'public/lib/textAngular/dist/textAngular-sanitize.min.js',
				'public/lib/textAngular/dist/textAngular.min.js',
				'public/lib/lunr.js/lunr.min.js',
				'public/lib/lodash/dist/lodash.min.js'
			]
		},
		css: [
			'public/lib/textAngular/src/textAngular.css',
			'public/css/*.css',
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
