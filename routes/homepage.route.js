var express = require('express');
var articleModel = require('../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

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

module.exports = router;