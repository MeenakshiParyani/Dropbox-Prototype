var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

// Connect to mongo db
mongoose.connect('mongodb://localhost/dropbox')
	.then(function(){
	  console.log(" Connected to DropBox Mongo DB ".green);

	}).catch(err => console.error(err));

var userSchema = new schema({
	firstname : { type : String },
	lastname  : { type : String },
	email      : { type : String, index : true },
  password   : { type : String }
});

var User = module.exports = mongoose.model('users', userSchema);

module.exports.createUser  = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
				newUser.save(callback);
    });
	});
}

module.exports.getUserByEmail = function(email, callback){
	var query = { email : email };
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candiatePassword, hash, callback){
	bcrypt.compare(candiatePassword, hash, function(err, isMatch) {
		callback(err, isMatch);
	});
}

module.exports.updateGroups = function(query, newValues, callback){
	User.updateOne(query, newValues, function(err, res) {
		console.log(err);
		console.log(res);
		callback(err, res);
	});
}
