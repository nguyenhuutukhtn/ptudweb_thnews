var express = require('express');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var subscriber = require('../controllers/subscriber.controller');
var request = require('request');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

router.get('/', (req, res) => {
    res.render('register');
})

router.post('/', (req, res) => {
    // if (req.body['g-recaptcha-response'] === undefined ||
    //     req.body['g-recaptcha-response'] === '' ||
    //     req.body['g-recaptcha-response'] === null) {
    //     console.log("Fill captcha please");
    //     res.redirect('/401');
    //     return;
    // }
    // //site key: 6LewbakUAAAAAJBNwFMlrtzoJxeIiLDJPIlAEvMd
    // const secretKey = "6LewbakUAAAAAKNW2pBz5YBLl22ujN1_Q5FPdXBo";

    // const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" +
    //     secretKey + "&response=" +
    //     req.body['g-recaptcha-response'] +
    //     "&remoteip=" + req.connection.remoteAddress;

    // request(verificationURL, function (error, response, body) {
    //     body = JSON.parse(body);

    //     if (body.success !== undefined && !body.success) {
    //         console.log("Fail captcha verification");
    //         res.redirect('/500');
    //         return;
    //     }
    //     console.log("Success");
    // });
    user = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birth_date: req.body.birth_date,
        pseudonym: req.body.pseudonym,
    }
    console.log(0);
    authentication.register(user, 'guests', res)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000 * 10, httpOnly: true });
            console.log("Success: ", token);
            res.redirect('/');
            return;
        })
        .catch(err => {
            res.redirect('/401');
            return;
        })
})

router.post('/admin', (req, res) => {
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
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/401');
        })
})

router.post('/subscriber', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, role, res)
        .then(temp => {
            authentication.getPayLoadToken(token, res)
                .then(temp => {
                    subscriber.register(res.id)
                        .then(temp => {
                            res.redirect('/');
                        })
                        .catch(err => {
                            res.redirect('/500');
                        })
                })
                .catch(err => {
                    res.redirect('/500');
                })
        })
        .catch(err => {
            res.redirect('/401');
        })
})


module.exports = router;