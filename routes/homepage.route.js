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
//var GoogleStategy = require('passport-google-auth').OAuth2Strategy;
var guestRole = require('../middlewares/guestRole.mdw');
var editorRole = require('../middlewares/editorRole.mdw');
var bcrypt = require('bcryptjs');
var userModel = require('../models/users.model');

const NodeCache = require("node-cache");
const myCache = new NodeCache();

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
router.use(require('../middlewares/FiveLastestComment.mdw'));
router.use(require('../middlewares/TopEightHot.mdw'));
router.use(require('../middlewares/TopThreeHot.mdw'));
router.use(require('../middlewares/MostRecommend.mdw'));
router.use(require('../middlewares/TopFourRecommend.mdw'));
router.use(require('../middlewares/AnotherNews.mdw'))
router.use(require('../middlewares/HotInWeek.mdw'))
router.use(require('../middlewares/TopFiveCommonKeywords.mdw'))
router.use(require('../middlewares/feadturedWritter.mdw'))


//Trash. Just!... I don't know maybe it's just another stressful day

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

passport.use(new FacebookStrategy({
    // điền thông tin để xác thực với Facebook.
    // những thông tin này đã được điền ở file auth.js
    clientID: configAuth.facebook.app_id,
    clientSecret: configAuth.facebook.app_secret,
    callbackURL: configAuth.facebook.call_back,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
},
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile, done) {
        // asynchronous
        console.log(1);
        process.nextTick(function () {
            // tìm trong db xem có user nào đã sử dụng facebook id này chưa
            console.log(2);
            console.log("profile: ", profile);
            userModel.getByFacebookID(profile.id)
                .then(user => {
                    console.log(user);
                    if (user.length !== 0) {
                        var temp;
                        authentication.issueTokenWithUser(user, temp)
                            .then(token => {
                                success = myCache.set("token", token, 10000);
                                return done(null, user);
                            })
                            .catch(err => {
                                console.log(err);
                                return done(err);
                            })
                        console.log("Have itttttttttttttttt");
                    } else {
                        var hashedPassword = bcrypt.hashSync('123', 8);
                        console.log(profile);
                        var newUser = {
                            facebook_id: profile.id,
                            email: profile.emails[0].value,
                            password: hashedPassword,
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName
                        }
                        // // lưu các thông tin cho user
                        // lưu vào db
                        var temp;
                        authentication.register(newUser, 'guests', temp)
                            .then(token => {
                                console.log("Start cache");
                                success = myCache.set("token", token, 10000);
                                console.log("End cache");
                                return done(null, newUser);
                            })
                            .catch(err => {
                                console.log(err);
                                return done(err);
                            })
                    }
                })
                .catch(err => {
                    console.log("errr");
                    console.log(err);
                    return done(err);
                })
        });
    })
);

// passport.use(new GoogleStategy({
//     // điền thông tin để xác thực với Facebook.
//     // những thông tin này đã được điền ở file auth.js
//     clientID: configAuth.google.app_id,
//     clientSecret: configAuth.google.app_secret,
//     callbackURL: configAuth.google.call_back,
// },
//     // Facebook sẽ gửi lại chuối token và thông tin profile của user
//     function (token, refreshToken, profile, done) {
//         // asynchronous
//         console.log(1);
//         process.nextTick(function () {
//             // tìm trong db xem có user nào đã sử dụng facebook id này chưa
//             console.log(2);
//             console.log("profile: ", profile);
//             userModel.getByGoogleID(profile.id)
//                 .then(user => {
//                     console.log(user);
//                     if (user.length !== 0) {
//                         var temp;
//                         authentication.issueTokenWithUser(user, temp)
//                             .then(token => {
//                                 success = myCache.set("token", token, 10000);
//                                 return done(null, user);
//                             })
//                             .catch(err => {
//                                 console.log(err);
//                                 return done(err);
//                             })
//                         console.log("Have itttttttttttttttt");
//                     } else {
//                         var hashedPassword = bcrypt.hashSync('123', 8);
//                         console.log(profile);
//                         var newUser = {
//                             facebook_id: profile.id,
//                             email: profile.emails[0].value,
//                             password: hashedPassword,
//                             first_name: profile.name.givenName,
//                             last_name: profile.name.familyName
//                         }
//                         // // lưu các thông tin cho user
//                         // lưu vào db
//                         var temp;
//                         authentication.register(newUser, 'guests', temp)
//                             .then(token => {
//                                 console.log("Start cache");
//                                 success = myCache.set("token", token, 10000);
//                                 console.log("End cache");
//                                 return done(null, newUser);
//                             })
//                             .catch(err => {
//                                 console.log(err);
//                                 return done(err);
//                             })
//                     }
//                 })
//                 .catch(err => {
//                     console.log("errr");
//                     console.log(err);
//                     return done(err);
//                 })
//         });
//     })
// );


//-----------------------------------------------

router.use('/guest', guestRole);
//router.use('/editor', editorRole);

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
            res.redirect('/');
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
            res.redirect('/');
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
            res.redirect('/');
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
            res.redirect('/');
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
            res.redirect('/');
            res.render('home');
        })
        .catch(err => {
            res.render('401');
        })
})

router.get('/authentication/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
    function (req, res) {
        value = myCache.get("token");
        if (value == undefined) {
            // handle miss!
            console.log("Empty cache");
        }
        res.cookie('Authorization', value, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    });

router.get('/authentication/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
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
                            res.redirect('/');
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