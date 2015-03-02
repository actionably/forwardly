'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

var PersonDataSourceSchema = new Schema({
	email: {
		type: String,
		required: 'Please fill in email',
		trim: true
	},
	type: {
		type: String,
		required: 'Please fill in type',
		trim: true
	},
	data: {
		type: Schema.Types.Mixed
	}
});

PersonDataSourceSchema.index({email:1, type: 1}, {unique:true});
PersonDataSourceSchema.plugin(deepPopulate);
PersonDataSourceSchema.plugin(timestamps);
mongoose.model('PersonDataSource', PersonDataSourceSchema);
