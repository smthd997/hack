var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Webb' });
});

router.get('/login/', function(req, res, next) {
    res.render('login', { title: 'Login to Facebook' });
});

module.exports = router;

