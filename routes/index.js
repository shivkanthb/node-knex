var express = require('express');
var router = express.Router();

/* GET home page. */

var home = require('../app.js');
var knex = home.knex;

router.get('/', function(req, res) {
	knex.select().table('users')
	.catch(function(error) {
		console.error(error);
	})
	.then(function(users) {
		console.log(users);
	})
  res.json({ title: 'Express' });
});

router.get('/new', function(req,res) {
	var name = req.query.name;
	knex('users').insert({name: name})
	.catch(function(error) {
	    console.error(error);
	})
	.then(function(id) {
	    console.log("inserted "+JSON.stringify(id));
	    res.json({message:"new user inserted"});
	})
});

module.exports = router;
