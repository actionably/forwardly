'use strict';

var aws = require('aws-sdk'),
	Q = require('q');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null
	});
};

exports.sign_s3 = function(req, locals) {
	var s3 = new aws.S3({region: 'us-west-1'});
	var bucketName = locals.config.amazonAWS.s3Bucket;
	console.log(bucketName);
	var s3_params = {
		Bucket: bucketName,
		Key: req.query.s3_object_name,
		Expires: 60,
		ContentType: req.query.s3_object_type,
		ACL: 'public-read'
	};
	return Q.Promise(function (resolve, reject) {
		s3.getSignedUrl('putObject', s3_params, function(err, data) {
			if (err) {
				reject(err);
				return;
			}
			var return_data = {
				signed_request: data,
				url: 'http://' + bucketName + '.s3.amazonaws.com/' + req.query.s3_object_name
			};
			resolve(return_data);
		});
	});
};
