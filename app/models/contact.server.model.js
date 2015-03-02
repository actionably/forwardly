'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

var ContactSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		required: 'Please fill in user',
		ref: 'User'
	},
	email: {
		type: String,
		required: 'Please fill in email',
		trim: true
	},
	name: {
		type: String,
		trim: true
	},
	sentCount : {
		type: Number,
		required: 'Please fill in sentCount'
	},
	fullContact: {
		type: Schema.ObjectId,
		ref: 'PersonDataSource'
	},
	pipl: {
		type: Schema.ObjectId,
		ref: 'PersonDataSource'
	}
});

ContactSchema.index({user:1, email: 1}, {unique:true});
ContactSchema.index({user:1, sentCount: 1});
ContactSchema.plugin(deepPopulate);
ContactSchema.plugin(timestamps);
mongoose.model('Contact', ContactSchema);
