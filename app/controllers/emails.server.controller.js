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
	Contact = mongoose.model('Contact'),
	FullContact = mongoose.model('FullContact'),
	EmailParser = require('email-addresses'),
	rp = require('request-promise'),
	Queues = require('../utils/queues'),
	Google = require('../utils/google'),
	config = require('../../config/config'),
	l = require('../utils/logging'),
	Q = require('q'),
	_ = require('lodash');

function addToContacts(contacts, parsedEmail) {
	if (!parsedEmail.address) {
		return;
	}
	var contact = _.findWhere(contacts, {email:parsedEmail.address});
	if (!contact) {
		contact = {
			email:parsedEmail.address,
			name:parsedEmail.name,
			sentCount:1
		};
		contacts.push(contact);
	} else {
		contact.sentCount++;
		if (!contact.name) {
			contact.name = parsedEmail.name;
		}
	}
}

exports.addFullContactToAll = function (req) {
	var message = {
		userId: req.user._id,
		query: 'user_contacts',
		queueName: 'add_fullcontact_queue',
		delay: 2,
		batchSize: 5,
		maxResults: 1000
	};
	return Queues.post('process_db_items_queue', JSON.stringify(message));
};

exports.extractAllContacts = function (req) {
	var message = {
		userId: req.user._id,
		query: 'user_emails',
		queueName: 'extract_contacts_queue'
	};
	return Queues.post('process_db_items_queue', JSON.stringify(message));
};

function getQuery(queryName, req) {
	var userId = req.body.userId;
	if (queryName === 'user_emails') {
		return EmailMetadata.find({user:userId});
	} else if (queryName === 'user_contacts') {
		return Contact.find({user:userId}).sort('-sentCount');
	}
}

exports.workerProcessDbItems = function (req) {
	var batchSize = req.body.batchSize || 100;
	var delay = req.body.delay || 0;
	var page = req.body.page || 1;
	req.body.page = page+1;
	var skip = req.body.skip || 0;
	req.body.skip = skip + batchSize;
	var query = getQuery(req.body.query, req);
	var maxResults = req.body.maxResults;
	var userId = req.body.userId;
	if (maxResults && skip >= maxResults) {
		return {success:true};
	}
	return query
		.select('_id')
		.skip(skip)
		.limit(batchSize)
		.exec()
		.then(function (ids) {
			if (ids.length === 0) {
				return {success: true};
			}
			var messages = _.map(ids, function(id) {
				return {
					delay: delay * page,
					body: JSON.stringify({
						id: id._id,
						userId: userId
					})
				};
			});
			return Queues.post(req.body.queueName, messages).then(function() {
				return Queues.post('process_db_items_queue', JSON.stringify(req.body));
			});
		});
};

exports.workerAddFullContact = function(req) {
	var id = req.param('id');
	var userId = req.param('userId');
	return Contact.findById(id).exec().then(function (contact) {
		return FullContact.findOne({email:contact.email}).exec().then(function (fullContact) {
			if (fullContact) {
				contact.fullContact = fullContact;
				return contact.savePromise();
			}
			var url = 'https://api.fullcontact.com/v2/person.json?email='+encodeURIComponent(contact.email)+'&apiKey='+config.fullContact.apiKey;
			var args = {
				uri: url,
				resolveWithFullResponse: true,
				simple:false
			};
			return Q.Promise(function (resolve, reject) {
				return rp(args).then(function (response) {
					if (response.statusCode === 200) {
						fullContact = new FullContact({
							email:contact.email,
							data:JSON.parse(response.body)
						});
						return fullContact.savePromise().then(function (savedFullContact) {
							contact.fullContact = savedFullContact;
							return contact.savePromise();
						});
					} else if (response.statusCode === 404) {
						var data = JSON.parse(response.body);
						if (data.message === 'Searched within last 24 hours. No results found for this Id.') {
							//this means full contact has no data which is ok.
							l('no data for '+contact.email);
							return resolve({success:true});
						}
					}
					return reject(response.body);
				});
			});
		});
	});
};

exports.workerExtractContacts = function(req) {
	var id = req.param('id');
	var userId = req.param('userId');
	return EmailMetadata.findById(id).exec()
		.then(function(email) {
			var parsedEmails = [];
			var toHeader = _.findWhere(email.metadata.payload.headers, {name:'To'});
			if (toHeader) {
				parsedEmails = parsedEmails.concat(EmailParser.parseAddressList(toHeader.value));
			}
			var ccHeader = _.findWhere(email.metadata.payload.headers, {name:'Cc'});
			if (ccHeader) {
				parsedEmails = parsedEmails.concat(EmailParser.parseAddressList(ccHeader.value));
			}
			var promises = [];
			_.forEach(parsedEmails, function(parsedEmail) {
				if (parsedEmail && parsedEmail.address) {
					var dbContact = {
						user:userId,
						email:parsedEmail.address,
						$inc: {sentCount:1}
					};
					if (parsedEmail.name) {
						dbContact.name = parsedEmail.name;
					}
					promises.push(Contact.findOneAndUpdate({user:userId, email:dbContact.email}, dbContact, {upsert:true}).exec());
				}
			});
			return Q.all(promises);
		})
		.then(function() {
			return {success:true};
		});
};


exports.downloadAll = function (req) {
	var message = {
		accessToken:req.user.additionalProvidersData.google.accessToken,
		userId:req.user._id
	};
	return Queues.post('email_list_queue', JSON.stringify(message));
};



exports.workerDownloadList = function (req) {
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
			queueMessages.push({body:JSON.stringify(message), delay:60*5});
		});
		return Queues.post('email_queue', queueMessages).then(function () {
			if (data.nextPageToken) {
				var listMessage = {
					accessToken:accessToken,
					userId:userId,
					pageToken: data.nextPageToken
				};
				return Queues.post('email_list_queue', JSON.stringify(listMessage)).then(function() {
					return {success:true};
				});
			} else {
				return {success:true};
			}
		});
	});
};

exports.workerDownloadOne = function (req) {
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

