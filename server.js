var express = require('express');
var app = express();
var User = require('./Secured');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:imaboss13@ds123658.mlab.com:23658/testfriend');
var body = require('body-parser')


var port = process.env.PORT || 8080;

app.set('port', (process.env.PORT || 8080));

app.use(body.urlencoded({extended: true}));
app.use(require('express-session')({
	secret:'fuck',
	resave:false,
	saveUnitialized: false
}));
app.set('view engine', 'ejs');
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());


	app.use(express.static('views/css'));
		app.use(express.static('views/js'));



var holder = mongoose.Schema({
	
	title: [String],
	post: [String],
	user: [String],
	id1: [String],
    comment:{comment: [String],  users:[String]},
});


var hammer = mongoose.model('hammer', holder);

var finder = hammer.find({});

function loggedin(req,res,next) {
	if(req.isAuthenticated()) {
		next();
	}
	else {
		res.send('please go back and log in, Thank you!');
	}
	};


app.get('/post/:id', loggedin, function (req, res) { 
hammer.findById(req.params.id, function (err, docs) {
  res.render('post', {
   userID:req.user.id,
   postid: docs,
   title: docs.title,
   posts: docs.post,
   userPoster: docs.user,
   comment:docs.comment,
   
   });

});
});

app.post('/post/:id', loggedin, function (req, res) { 


	if ( req.body.comment < (10) || (''))
      {  
		res.send('Please enter some more characters, thanks');		

	}
	else {
		hammer.findById(req.params.id, function (err, doc) {
		    doc.comment.comment.push(req.body.comment);
			doc.comment.users.push(req.user.username);

			doc.save(function (err, obj) {
				res.redirect('/home');
				
			});
		
			});
		}
		

	});
	




app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});






app.get('/profile/:id', loggedin, function (req, res){
  hammer.find({user: req.user.username}, function (err, doc) {
	res.render('profile', { username:req.user.username,
                            posts:doc,
                            userID:req.user.id							
		});
	
	
  });
});


app.get('/submission', loggedin, function (req, res) {
	
	
	
     res.render('newPost', {userID: req.user.id});
});

	
	
	





app.get('/home', loggedin, function (req, res) {
 hammer.find({user: req.user.username}, function (err, info){
   finder.exec(function (err, doc) {
     res.render('Createthread', {userID:req.user.id,
		                         posts:doc,
	                             title:req.user.username,
								 author:doc.user
								 });
	
});
	
	
 })
});


app.get('/register', function (req, res) {
	res.sendFile(__dirname + '/register.html');	
});

app.get('/loggedin', function (req, res) {
	res.sendFile(__dirname + '/loggedin.html');
});


app.post('/register', function (req, res) {
User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
	if(err) {
		res.send('your authentication has failed, please try again');
	}
	passport.authenticate('local')(req, res, function (){
	 res.redirect('/profile/' + req.user.id);
	
});
});
});


app.get('/login', function(req, res) {
	
		res.sendFile(__dirname + '/login.html');

	
});
app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/home');
});


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/login.html');
	
	
	
	
	
});

app.post('/submission', loggedin, function (req, res) {
	
	content = new hammer();
	if ((req.body.title.length || req.body.post1) < 10 || '')
      {  
		res.send('Title and Post much each have over 10 chars, thanks');		

	}
	else {  
	        content.id1 = req.user.id;
		    content.user = req.user.username;
			content.title = req.body.title;
              content.post = req.body.post1;
			  content.comment.comment = [];
			  content.comment.user = [];
	content.save(function(err, obj) {
		res.redirect('/home');
		
	});	
	}
	
});


app.listen(port, function (req, res){
	
	console.log('listening sir!');
})


