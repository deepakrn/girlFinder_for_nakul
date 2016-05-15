var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
/*
var userProfileSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	undergrad: {college: {type:String, required: true}, course: {type:String, required: true}, specialization: {type:String, required: true}},
	grad: {college: {type:String, required: true}, course: {type:String, required: true}, specialization: {type:String, required: true}},
	dob: {type: Date}
});*/
var responseObjectSchema = new Schema({
	interested: {type: String, required: false},
	 questions: {type: String, required: false},
	  interact: {type:String, required: false},
	        id: {type:String, unique:true, required:true}	
});
// the schema is useless so far
// we need to create a model using it
var responseObject = mongoose.model('responseObject', responseObjectSchema);

// make this available to our users in our Node applications
module.exports = responseObject;