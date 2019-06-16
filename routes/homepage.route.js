var express = require('express');
var articleModel = require('../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
//var session = require('express-session');
var flash = require('connect-flash');


var fs = require("fs");
var privateKey = fs.readFileSync('private.key');

//router.use(session({secret: privateKey}));
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


router.get('/', (req, res) => {
    var p = articleModel.all();
    p.then(rows => {
        res.render('home')
        //console.log(rows);
    }).catch(err => {
        console.log(err);
    });
})

router.get('/verify', async (req, res) => {
    var token = req.cookies['Authorization'];
    await authentication.verify(token, res);
    if (res.err != null) {
        res.status(401).send({
            message: "Unauthorized"
        })
    } else {
        await authentication.getPayLoadToken(token, res);
        res.status(200).send({
            message: "Ok"
        })
    }
})

router.post('/log_in', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    authentication.login(email, password)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            res.status(200).send({
                "message": "Success"
            })
        })
        .catch(err => {
            res.status(401).send({
                message: "Unauthorized"
            })
        })
})

router.post('/register', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    authentication.register(email, password, 'guests', res)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            res.status(200).send({
                "message": "Success"
            })
        })
        .catch(err => {
            res.status(401).send({
                message: "Unauthorized"
            })
        })
})

router.post('/log_out', async (req, res) => {
    var token = req.cookies['Authorization'];
    await authentication.verify(token, res)
    if (res.err != null) {
        res.status(401).send({
            message: "Unauthorized"
        })
    } else {
        res.clearCookie('Authorization');
        res.status(200).send({
            "message": "Success"
        })
    }
})

router.post('/authentication/facebook', 
passport.authenticate('facebook', {scope: ['email']}));
// xử lý sau khi user cho phép xác thực với facebook
router.post('/authentication/facebook/callback',
passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
})
);

module.exports = router;