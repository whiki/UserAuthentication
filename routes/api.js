const express = require('express');
const router = express.Router();
const Users = require('../model/users');





//Testrun the route
router.get('/', function(req,res,next){
	return res.sendFile(path.join(__dirname + '/public/index.html'));
});

//POST route for creating data
router.post('/', function(req, res, next){
	//confirm if the password was currectly typed twice
	if (req.body.password !== req.body.passwordConf){
		var err = new Error('Passwords don\'t match');
		err.status - 400;
		res.send("Passwords don't match");
		return next(err);
	} else if (req.body.email && req.body.username && req.body.password && req.body.passwordConf){
			Users.create(req.body, function(error, user){
				if(error){
					return next(error);
				} else {
				req.session.userId = user._id;
				// return res.send(user);
				return res.redirect('/profile');
				// console.log(user);
				}	
			});
		} else if (req.body.logemail && req.body.logpassword){
			Users.authenticate(req.body.logemail,req.body.logpassword, function(error, user){
				if (error || !user){
					var err = new Error('Wrong email or password');
					err.status = 401;
					return next(err);
				}else{
					req.session.userId = user._id;
					return res.redirect('/profile');
				}
			});
	} else{
		var err = new Error('All field required.')
		err.status = 400;
		return next(err);
	};
});


//GET route after registering
router.get('/profile',function(req, res, next){
	Users.findById(req.session.userId).exec(function(error,user){
		if (error){
			return next(error);
		}else{
			if(user == null){
				var err = new Error ('Not authorized! Go back');
				err.status = 400;
				return next(err);
			}else{
				return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
			}
		}
	});
});

//GET route logout
router.get('/logout', function(req,res,next){
	if (req.session){
		//delete session
		req.session.destroy(function(err){
			if (err){
				return next(err);
			}else{
				return res.redirect('/');
			}
		});
	}
});

module.exports = router;