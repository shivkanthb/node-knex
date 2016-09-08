

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var knex = require('knex')({
  client: 'pg',
  connection: 'pg://shiv:root@localhost:5432/knex_test',
  searchPath: 'knex,public'
});
module.exports.knex=knex;

var routes = require('./routes/index');
var users = require('./routes/user');


var pg = require('pg');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


// knex.schema.dropTable('users')
// .catch(function(error) {
//     console.error(error);
// })
// .then(function() {
//     console.log("dropped");
// })


knex.schema.createTableIfNotExists('users', function (table) {
  table.increments();
  table.string('name');
  table.timestamps(false,true);
})
.catch(function(error) {
    console.error(error);
})
.then(function() {
    console.log("created");
})


// knex.select().table('users')
// .catch(function(error) {
//     console.error(error);
// })
// .then(function(users) {
//     console.log(users[0]);
// })

// knex('users').insert({name: 'Shiv'})
// .catch(function(error) {
//     console.error(error);
// })
// .then(function(id) {
//     console.log("inserted "+JSON.stringify(id));
// })


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
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
        title: 'error'
    });
});


module.exports = app;
