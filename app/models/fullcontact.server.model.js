'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

var FullContactSchema = new Schema({
	email: {
		type: String,
		required: 'Please fill in email',
		unique: true,
		trim: true
	},
	data: {
		type: Schema.Types.Mixed
	}
});

FullContactSchema.plugin(deepPopulate);
FullContactSchema.plugin(timestamps);
mongoose.model('FullContact', FullContactSchema);
