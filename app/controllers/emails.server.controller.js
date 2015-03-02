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
	PersonDataSource = mongoose.model('PersonDataSource'),
	EmailParser = require('email-addresses'),
	rp = require('request-promise'),
	Queues = require('../utils/queues'),
	Google = require('../utils/google'),
	config = require('../../config/config'),
	l = require('../utils/logging'),
	Q = require('q'),
	_ = require('lodash');

exports.listContacts = function (req) {
	var user = req.user;
	return Contact.find({user:user}).sort({sentCount:-1}).populate('fullContact pipl').limit(200).exec();
};

exports.addPersonDataSourceToAll = function (req) {
	var type = req.param('type');
	var message = {
		userId: req.user._id,
		query: 'user_contacts',
		queueName: 'add_person_data_queue',
		delay: (type === 'fullContact' ? 2: 5),
		batchSize: (type === 'fullContact' ? 5: 20),
		maxResults: (type === 'fullContact' ? 1000: 200),
		type: type
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
	var type = req.body.type || '';
	if (maxResults && skip >= maxResults) {
		return {success:true};
	}
	return query
		.select('_id')
		.skip(skip)
		.limit(batchSize)
		.exec()
		.then(function (ids) {
			l('processing ', req.body);
			l('ids.length ', ids.length);
			if (ids.length === 0) {
				return {success: true};
			}
			var messages = _.map(ids, function(id) {
				return {
					delay: delay * page,
					body: JSON.stringify({
						id: id._id,
						userId: userId,
						type: type
					})
				};
			});
			return Queues.post(req.body.queueName, messages).then(function() {
				return Queues.post('process_db_items_queue', JSON.stringify(req.body));
			});
		});
};

function getUrl(contact, type) {
	if (type === 'fullContact') {
		return 'https://api.fullcontact.com/v2/person.json?email='+encodeURIComponent(contact.email)+'&apiKey='+config.fullContact.apiKey;
	} else {
		var query = {
			emails : [{
				address:contact.email
			}]
		};
		if (contact.fullContact &&
			contact.fullContact.data &&
			contact.fullContact.data.contactInfo &&
			contact.fullContact.data.contactInfo.familyName &&
			contact.fullContact.data.contactInfo.givenName) {
			query.name = [{
				first : contact.fullContact.data.contactInfo.givenName,
				last : contact.fullContact.data.contactInfo.familyName
			}];
		}
		if (contact.fullContact &&
			contact.fullContact.data &&
			contact.fullContact.data.demographics &&
			contact.fullContact.data.demographics.locationDeduced &&
			contact.fullContact.data.demographics.locationDeduced.city &&
			contact.fullContact.data.demographics.locationDeduced.state &&
			contact.fullContact.data.demographics.locationDeduced.country &&
			contact.fullContact.data.contactInfo.givenName) {
			query.addresses = [{
				city : contact.fullContact.data.demographics.locationDeduced.city.name,
				state : contact.fullContact.data.demographics.locationDeduced.state.code,
				country : contact.fullContact.data.demographics.locationDeduced.country.code
			}];
		}
		l('query = ', query);
		return 'http://api.pipl.com/search/v4/?person='+encodeURIComponent(JSON.stringify(query))+'&key='+config.pipl.apiKey;
	}
}

exports.workerAddPersonDataSource = function(req) {
	var id = req.param('id');
	var userId = req.param('userId');
	var type = req.param('type');
	return Contact.findById(id).populate('fullContact').exec().then(function (contact) {
		return PersonDataSource.findOne({email:contact.email, type:type}).exec().then(function (dataSource) {
			if (dataSource) {
				contact[type] = dataSource;
				return contact.savePromise();
			}
			var url = getUrl(contact, type);
			var args = {
				uri: url,
				resolveWithFullResponse: true,
				simple:false
			};
			return Q.Promise(function (resolve, reject) {
				return rp(args).then(function (response) {
					if (response.statusCode === 200) {
						dataSource = new PersonDataSource({
							email:contact.email,
							type:type,
							data:JSON.parse(response.body)
						});
						return dataSource.savePromise().then(function (savedDataSource) {
							contact[type] = savedDataSource;
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
			if (email.processed) {
				return {success:true};
			}
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
			return Q.all(promises).then(function() {
				email.processed = true;
				return email.savePromise();
			});
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

