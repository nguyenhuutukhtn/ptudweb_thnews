var express = require('express');
var cookieParser = require('cookie-parser');
var forgotController = require('../controllers/forgot.controller');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var flash = require('connect-flash');
var session = require('express-session');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(session({ secret: "_____secret_key______" }));

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

const NodeCache = require("node-cache");
const myCache = new NodeCache();

router.use(flash()); // use connect-flash for flash messages stored in session

router.get('/', (req, res) => {
    res.render('forgot');
})

router.post('/', (req, res) => {

    var email = req.body.email;

    console.log("email: ", email);

    var smtpTransport = nodemailer.createTransport({
        service: 'sendgrid',
        auth: {
            user: 'trungtin2qn1',
            pass: 'tin123456'
        }
        //service: 'gmail',
        //host: "smtp.gmail.com",
        //secure: true,
        // auth: {
        //     type: 'login', // default
        //     user: 'trunghieu0697@gmail.com',
        //     pass: 'qwerty12345qwerty'
        // }
    });

    console.log(0);

    var mailOptions = {
        to: email,
        from: 'trungtin2qn1@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:3000/forgot/reset/' + email + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    console.log(1);

    smtpTransport.sendMail(mailOptions, function (err) {
        console.log(err);
        req.flash('info', 'An e-mail has been sent to ' + email + ' with further instructions.');
        console.log(2);
        res.redirect('/');
    });
});

router.get('/reset', (req, res) => {
    res.render('reset');
})

router.post('/reset', (req, res) => {
    console.log(req.headers);
    var newPassword = req.body.new_password;
    var confirmPassword = req.body.confirm_password;
    console.log("new password: ", newPassword);
    console.log("confirm password: ", confirmPassword);
    var email = myCache.get('reset-email');
    console.log("email: ",email);
    forgotController.reset(email, newPassword, confirmPassword)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000 * 10, httpOnly: true });
            console.log("Success: ", token);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        })
})

router.get('/reset/:email', (req, res) => {
    var email = req.params.email;
    myCache.set('reset-email', email);
    console.log("email: ", email);
    res.redirect('/forgot/reset');
})

module.exports = router;