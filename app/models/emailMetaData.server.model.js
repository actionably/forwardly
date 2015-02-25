'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

var EmailMetadataSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		required: 'Please fill user',
		ref: 'User'
	},
	gmailId: {
		type: String,
		required: 'Please fill gmailId',
		unique: true
	},
	metadata: {
		type: Schema.Types.Mixed,
		required: 'Please fill meta data'
	}
});

EmailMetadataSchema.plugin(deepPopulate);
EmailMetadataSchema.plugin(timestamps);
mongoose.model('EmailMetadata', EmailMetadataSchema);
