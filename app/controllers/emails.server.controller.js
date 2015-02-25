'use strict';

/*
   Header notes:
 Delivered-To - email address recieved on.
 From - person sending
 To - people who recieved email.
 Date - when email was sent

 */

var mongoose = require('mongoose'),
	EmailMetadata = mongoose.model('EmailMetadata'),
	queues = require('../utils/queues'),
	Google = require('../utils/google'),
	_ = require('lodash');

exports.downloadAll = function (req) {
	var message = {
		accessToken:req.user.additionalProvidersData.google.accessToken,
		userId:req.user._id
	};
	return queues.post('email_list_queue', JSON.stringify(message));
};

exports.downloadList = function (req) {
	var accessToken = req.body.accessToken;
	var userId = req.body.userId;
	var pageToken = req.body.pageToken;
	var url = 'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=from%3Ame';
	if (pageToken) {
		url += '&pageToken='+pageToken;
	}
	return Google.get(url, accessToken).then(function(data) {
		var queueMessages = [];
		_.forEach(data.messages, function(item) {
			var message = {accessToken:accessToken, userId:userId};
			message.id = item.id;
			queueMessages.push(JSON.stringify(message));
		});
		return queues.post('email_queue', queueMessages).then(function () {
			if (data.nextPageToken) {
				var listMessage = {
					accessToken:accessToken,
					userId:userId,
					pageToken: data.nextPageToken
				};
				return queues.post('email_list_queue', JSON.stringify(listMessage)).then(function() {
					return {success:true};
				});
			} else {
				return {success:true};
			}
		});
	});
};

exports.downloadOne = function (req) {
	var accessToken = req.body.accessToken;
	var userId = req.body.userId;
	var id = req.body.id;
	var url = 'https://www.googleapis.com/gmail/v1/users/me/messages/'+id+'?format=metadata';
	return Google.get(url, accessToken).then(function(data) {
		var emailMetadata = {
			user : userId,
			metadata : data,
			gmailId : id
		};
		return EmailMetadata.findOneAndUpdate({gmailId:id}, emailMetadata, {upsert:true}).exec().then(function (dbData) {
			return {success:true};
		});
	});
};

