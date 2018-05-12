const express = require('express');
const routes = require('./routes/api');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


//setup express
const app = express();

//connect database
mongoose.connect('mongodb://localhost/users');
mongoose.Promise = global.Promise; //i don't understand what this does.
const db = mongoose.connection;

//handle mongo error
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){

});

//use session for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

//parse incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//serve static files from public template
app.use(express.static(__dirname + '/public'));


//Handle my routes first
app.use('/', routes);


// //Error Handling using middleware
// app.use(function(err, req, res, next){
// 	console.log(err);
// });

//Run the server and listen on port 3000
app.listen(3000, function(){
	console.log("Server is live and running on port 3000");
});
