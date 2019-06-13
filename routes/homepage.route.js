var express = require('express');
var articleModel = require('../models/article.model');
var tokenHandler = require('../middlewares/tokenHandler');
var cookieParser = require('cookie-parser')

var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
// parse application/json
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
    await tokenHandler.verify(req, res, token);
    if (res.err != null){
        res.status(401).send({
            message: "Unauthorized"
        })
    } else {
        res.status(200).send({
            message: "Ok"
        })
    }
})

router.post('/register', async (req, res) => {
    var err = await tokenHandler.issue(req, res);
    if (err == false) {
        res.status(401).send({
            message: "Unauthorized"
        })
    } else {
        console.log(res.token);
        res.cookie('Authorization', res.token, { maxAge: 900000, httpOnly: true });
        res.status(200).send({
            token: res.token
        })
    }
})

module.exports = router;