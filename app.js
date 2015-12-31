var express = require('express');

var app = express();

app.disable('x-powered-by');

// ---------------- Main Layout ----------------------------------------------//
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// ---------------- Imports --------------------------------------------------//
app.use(require('body-parser').urlencoded({extended: true}));
var formidable = require('formidable');
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

// ---------------- Assign Port ----------------------------------------------//
app.set('port', process.env.PORT || 3000);

// ---------------- About ----------------------------------------------------//
//app.use(express.static(__dirnam + '/public'));
// req = request object, contains headers, body,
// res = respond object, object express recieve when ever it recieve a request
app.get('/', function(req, res){
  res.render('home');
});

// ---------------- Middleware -----------------------------------------------//
// Middleware
// Receive a request object and respond object and a next function
app.use(function(req, res, next){
  console.log("Looking for URL: " + req.url);
  next(); // Continue to look for routes
});

// ---------------- Middleware URL Message -----------------------------------//
// Post error message if they access a certain URL link
app.get('/trash', function(req, res, next){
  console.log('Tried to access /trash');
  // Throw error message
  throw new Error('Tried to access /trash');
});

// ---------------- Use Middleware Message -----------------------------------//
app.use(function(err, req, res, next){
  console.log('Error: ' + err.message);
  next();
});

// ---------------- /About -------------------------------------------------- //
app.get('/about', function(req, res){
  res.render('about');
});

// ---------------- Create Contact Route ------------------------------------ //
app.get('/contact', function(req, res){
  res.render('contact', {csrf: 'CSRF token here'});
});

// ---------------- Create Thankyou route ----------------------------------- //
app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

// ---------------- Process form -------------------------------------------- //
app.post('/process', function(req, res){
  console.log('Form: ' + req.query.form);
  console.log('CSRF token: ' + req.body._csrf);
  console.log('Email: ' + req.body.email);
  console.log('Question: ' + req.body.ques);
  res.redirect(303, '/thankyou');
});

// ---------------- 404 Middleware Error Message ---------------------------- //
app.use(function(req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});

// ---------------- 500 Middleware Error Message ---------------------------- //
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// ---------------- Listen -------------------------------------------------- //
// ---------------- Need to know what port to listen to --------------------- //
app.listen(app.get('port'), function(){
  console.log("Express started on http://localhost: " + app.get('port') + 'press Ctrl-C to terminate');
});
