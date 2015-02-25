'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
	iron_mq = require('iron_mq'),
	_ = require('lodash');


exports.post = function (queueName, messages) {
	var imq = new iron_mq.Client();
	var queue = imq.queue(queueName);
	return Q.Promise(function (resolve, reject) {
		queue.post(messages, function(error, body) {
			if (error) {
				reject(error);
				return;
			}
			resolve(body);
		});
	});
};

function configureQueue(imq, queueName, subscriberUrl) {
	var queue = imq.queue(queueName);
	queue.update({
			push_type: 'unicast',
			retries: 3,
			error_queue: 'error_queue',
			subscribers: [
				{url: subscriberUrl}
			]},
		function(error, body) {
			if (error) {
				console.error('unable to configure ironmq '+queueName+' : '+ error);
			}
		}
	);
}

exports.init = function(config) {
	var imq = new iron_mq.Client();
	configureQueue(imq, 'email_queue', config.ironIO.workerUrl+'/emails/downloadOne');
	configureQueue(imq, 'email_list_queue', config.ironIO.workerUrl+'/emails/downloadList');
};
