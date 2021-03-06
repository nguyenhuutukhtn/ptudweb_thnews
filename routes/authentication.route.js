var express = require('express');
var cookieParser = require('cookie-parser')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var bcrypt = require('bcryptjs');
var userModel = require('../models/users.model');
var configAuth = require('../config/auth');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var authenticationController = require('../controllers/authentication.controller');

const NodeCache = require("node-cache");
const myCache = new NodeCache();

var router = express.Router();
var bodyParser = require('body-parser');

router.use(session({ secret: "_____secret_key______" }));
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

//Trash. Just!... I don't know maybe it's just another stressful day

// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
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
                        authenticationController.issueTokenWithUser(user, temp)
                            .then(token => {
                                console.log("Have itttttttttttttttt");
                                console.log("token: ", token);
                                success = myCache.set("token", token, 10000);
                                return done(null, user);
                            })
                            .catch(err => {
                                console.log("Have itttttttttttttttt");
                                console.log(err);
                                return done(err);
                            })
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
                        authenticationController.register(newUser, 'guests', temp)
                            .then(token => {
                                console.log("Start cache");
                                console.log("token: ", token);
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

passport.use(new GoogleStrategy({
    // điền thông tin để xác thực với Facebook.
    // những thông tin này đã được điền ở file auth.js
    clientID: configAuth.google.app_id,
    clientSecret: configAuth.google.app_secret,
    callbackURL: configAuth.google.call_back,
},
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile, done) {
        // asynchronous
        console.log(1);
        process.nextTick(function () {
            // tìm trong db xem có user nào đã sử dụng facebook id này chưa
            console.log(2);
            console.log("profile: ", profile);
            userModel.getByGoogleID(profile.id)
                .then(user => {
                    console.log(user);
                    if (user.length !== 0) {
                        var temp;
                        authenticationController.issueTokenWithUser(user, temp)
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
                        console.log('avatar: ', profile.photos[0].value)
                        var newUser = {
                            facebook_id: profile.id,
                            email: profile.emails[0].value,
                            password: hashedPassword,
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            avatar: profile.photos[0].value,
                        }
                        console.log("Save user to data");
                        var temp;
                        authenticationController.register(newUser, 'guests', temp)
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

//-----------------------------------------------

router.get('/google/callback',
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
    function (req, res) {
        value = myCache.get("token");
        if (value == undefined) {
            // handle miss!
            console.log("Empty cache");
        }
        console.log("token: ", value);
        res.cookie('Authorization', value, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    });

router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
    function (req, res) {
    });

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    })
);

module.exports = router;