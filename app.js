const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const Session = require('express-session')
const utils  = require('./utils/utils')
const fs = require('fs')
const app = express();
const log4jsconfs = require('./configs/log4js')
const log4js = require('log4js');
log4js.configure(log4jsconfs)
const log = log4js.getLogger("app");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(Session({
  secret: 'miniwar-cms',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 2}, // 30 days
   name: 'miniwarcms'
}));

// create a rotating write stream
// if you want to use morgan 
/*
const rfs = require('rotating-file-stream')
const morgan = require('morgan');
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

*/
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const routeMaps = utils.loader(__dirname, 'routes', '/')
for (const key in routeMaps) {
  const element = routeMaps[key];
  app.use(key,element)
}

app.use(function (req, res, next) {
  var url = req.originalUrl;
  if (url == "" || url == "/" || url =='/index') {
      return  res.render('resume',{fileName:"/upload/person.pdf"});    
  }
  return  next()
  
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.statusCode = 404;
  res.render('404');
  res.end();
  next()
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

module.exports = app;
