var express = require('express');
var articleModel = require('../../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
//var session = require('express-session');
var flash = require('connect-flash');
var subscriber = require('../../controllers/subscriber.controller');

var fs = require("fs");
var privateKey = fs.readFileSync('private.key');

//router.use(session({secret: privateKey}));
router.use(passport.initialize());
//router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.render('main_writer')
})

module.exports = router;