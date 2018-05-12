const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

//Setup Schema for the users
const UserSchema = new Schema ({

	email: {
		type: String,
		trim: true,
		required: true,
		unique: true 
	},

	username: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true
	},

	passwordConf: {
		type: String,
		required: true,
	}
});

//hashing the password before saving it to the database
UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if(err){
			return next (err);
			// console.log(err);
		}
		user.password = hash;
		next();
	});
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password,callback){
	Users.findOne({email: email})
		.exec(function (err,user){
			if (err) {
				return callback(err)
			} else if (!user){
				var err = new Error ('User not found');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password,user.password, function(err,result){
				if(result === true){
					return callback(null, user);
				} else {
					return callback();
				}
			});
		});
};

const Users = mongoose.model('usercol', UserSchema);

module.exports = Users;

