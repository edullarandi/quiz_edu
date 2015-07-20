var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());



app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// Helpers dinamicos:


// AUTO-LOGOUT 
// Si la sesion está activa comprueba si existe la variable timeout
// Si no existe la crea. Si existe comprueba que no ha pasado el limite definido.
// Tiempo máxim 3 minutos: 1000 ms * 60 s * 3 m
app.use(function(req, res, next){
	if (req.session.user) {
	    console.log("Sesión inicializada: comprueba hora. ");
		if (req.session.timeout){			
			// getTime() Devuelve milisegundos
			var ahora = new Date().getTime();
			console.log("ahora: " + ahora );
			var tiempo = ahora - req.session.timeout;
			
			if (tiempo > (1000*180*1)){
			   console.log("TIMEOUT: Cerramos la sesion");
               delete req.session.user;
			}else{
				console.log("Guardamos la hora");
				req.session.timeout = ahora;				
			}
		}else{
			req.session.timeout = new Date().getTime();
		}		
	}
	next();
});

app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  console.log('**** PATH 1 ANTERIOR: ' + req.path);  
  if (!req.path.match(/\/login|\/logout/)) {
    console.log('**** PATH 2 ANTERIOR: ' + req.session.redir);  
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
