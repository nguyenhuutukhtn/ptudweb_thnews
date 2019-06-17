var express = require('express');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var subscriber = require('../controllers/subscriber.controller');

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
            res.cookie('Authorization', token, { maxAge: 900000 * 10, httpOnly: true });
            console.log("Success: ", token);
            res.render('home');
            res.redirect('/');
        })
        .catch(err => {
            res.render('401');
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
            res.render('home');
            res.redirect('/');
        })
        .catch(err => {
            res.render('401');
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