var express = require('express');
var articleModel = require('../../models/article.model');
var tagModel=require('../../models/tags.model')
var cookieParser = require('cookie-parser')
var authentication = require('../../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
//var session = require('express-session');
var flash = require('connect-flash');
var subscriber = require('../../controllers/subscriber.controller');
var adminController = require('../../controllers/admin.controller');

var fs = require("fs");
var privateKey = fs.readFileSync('private.key');

//router.use(session({secret: privateKey}));
router.use(passport.initialize());
//router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../../middlewares/GetAllCategory.mdw'))

var guestRole = require('../../middlewares/guestRole.mdw')
router.use('/', guestRole);

router.get('/', (req, res) => {
    res.render('main_admin')
})
router.get('/users', (req, res) => {
    res.render('admin_users')
})

router.post('/', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;
    var role = req.body.role;
    adminController.register(email, password, confirmPassword, role)
    .then(result => {
        res.redirect('/auth/admin');
    })
    .catch(err => {
        console.log(err);
        res.render('/500');
    })
})



module.exports = router;