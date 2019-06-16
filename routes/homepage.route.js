var express = require('express');
var articleModel = require('../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var subscriber = require('../controllers/subscriber.controller');
var FacebookStrategy = require('passport-facebook').Strategy;
var guestRole = require('../middlewares/guestRole.mdw');

var configAuth = require('../config/auth');
var tokenHandler = require('../utils/tokenHandler');
// var fs = require("fs");
// var privateKey = fs.readFileSync('private.key');

router.use(session({ secret: "_____secret_key______" }));
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/FourLastestNews.mdw'));
router.use(require('../middlewares/EightPopularNews.mdw'));
router.use(require('../middlewares/TopEightHot.mdw'));
router.use(require('../middlewares/TopThreeHot.mdw'));
router.use(require('../middlewares/MostRecommend.mdw'));
router.use(require('../middlewares/TopFourRecommend.mdw'));
router.use(require('../middlewares/AnotherNews.mdw'))
router.use(require('../middlewares/HotInWeek.mdw'))
router.use(require('../middlewares/TopFiveCommonKeywords.mdw'))
router.use(require('../middlewares/feadturedWritter.mdw'))

//Trash. Just!... I don't know maybe it's just another stressful day
passport.use(new FacebookStrategy({
    // điền thông tin để xác thực với Facebook.
    // những thông tin này đã được điền ở file auth.js
    clientID: configAuth.facebook.app_id,
    clientSecret: configAuth.facebook.app_secret,
    callbackURL: configAuth.facebook.call_back,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
},
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile) {
        // asynchronous
        process.nextTick(function () {
            // tìm trong db xem có user nào đã sử dụng facebook id này chưa
            userModel.getByFacebookID({ 'facebook_id': profile.id }, function (err, user) {
                if (err)
                    console.log("errr");
                // Nếu tìm thấy user, cho họ đăng nhập
                if (user) {
                    tokenHandler.issue(user.email, user.id)
                    console.log("Have itttttttttttttttt");
                    //return done(null, user); // user found, return that user
                } else {
                    // nếu chưa có, tạo mới user
                    console.log(profile);
                    var newUser = {
                        facebook_id: profile.id,
                        email: profile.emails[0].value,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName
                    }
                    // // lưu các thông tin cho user
                    // lưu vào db
                    userModel.add(newUser)
                        .then()
                        .catch()
                }
            });
        });
    })
);

//-----------------------------------------------

router.use('/guest', guestRole);

router.get('/', (req, res) => {
    var p = articleModel.all();
    p.then(rows => {
        res.render('home')
        //console.log(rows);
    }).catch(err => {
        console.log(err);
    });
})

router.get('/verify', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, res)
        .then(temp => {
            authentication.getPayLoadToken(token, res)
                .then(temp => {
                    res.render('home');
                })
                .catch(err => {
                    res.render('500');
                })
        })
        .catch(err => {
            res.render('401');
        })
})

router.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    console.log("email:", email);
    console.log("password: ", password);
    authentication.login(email, password)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            console.log("Success: ", token);
            res.render('home');
        })
        .catch(err => {
            res.render('401');
        })
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/forgot', (req, res) => {
    res.render('forgot');
})

router.post('/register', (req, res) => {
    user = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birth_date: req.body.birth_date,
        pseudonym: req.body.pseudonym,
    }
    authentication.register(user, 'guests', res)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            console.log("Success: ", token);
            res.render('home');
        })
        .catch(err => {
            res.render('401');
        })
})

router.post('/admin/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    console.log("email:", email);
    console.log("password: ", password);
    authentication.login(email, password)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            console.log("Success: ", token);
            res.render('home');
        })
        .catch(err => {
            res.render('401');
        })
})

router.post('/admin/register', (req, res) => {
    user = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birth_date: req.body.birth_date,
        pseudonym: req.body.pseudonym,
    }
    role = res.body.role;
    authentication.register(user, role, res)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            console.log("Success: ", token);
            res.render('home');
        })
        .catch(err => {
            res.render('401');
        })
})

router.post('/logout', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, res)
        .then(temp => {
            res.clearCookie('Authorization');
            res.status(200).send({
                "message": "Success"
            })
        })
        .catch(err => {
            res.render('401');
        })
})

router.post('/authentication/facebook',
    //     passport.authenticate('facebook', { scope: ['email'] }));
    // // xử lý sau khi user cho phép xác thực với facebook
    // router.post('/authentication/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/profile',
    //         failureRedirect: '/'
    //     })
    passport.authenticate('facebook', {
        scope: ['publish_actions', 'manage_pages', 'email']
    })
);

router.post('register/subscriber', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, role, res)
        .then(temp => {
            authentication.getPayLoadToken(token, res)
                .then(temp => {
                    subscriber.register(res.id)
                        .then(temp => {
                            res.render('home');
                        })
                        .catch(err => {
                            res.render('500');
                        })
                })
                .catch(err => {
                    res.render('500');
                })
        })
        .catch(err => {
            res.render('401');
        })
})

module.exports = router;