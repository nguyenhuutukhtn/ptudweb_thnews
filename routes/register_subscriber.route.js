var express = require('express');
var cookieParser = require('cookie-parser')
var registerSubscriberController = require('../controllers/subscriber.controller');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

var guestRole = require('../middlewares/guestRole.mdw');
router.use('/', guestRole);

router.get('/', (req, res) => {
    res.render('register_subscriber');
})

router.post('/', (req, res) => {
    console.log(1);
    registerSubscriberController.register(res.id)
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/500');
    })
})

module.exports = router;