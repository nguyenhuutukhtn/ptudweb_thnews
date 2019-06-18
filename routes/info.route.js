var express = require('express');
var cookieParser = require('cookie-parser');
var profileController = require('../controllers/profile.controller');
var router = express.Router('/info');
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
    profileController.getInfo(res.id)
    .then(result => {
        res.render('profile');
    })
    .catch(err => {
        res.redirect('/500');
    })
});

router.post('/', (req, res) => {
    var newInfo = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birth_date: req.body.birth_date,
        pseudonym: req.body.pseudonym,
        avatar: req.body.avatar,
    }
    profileController.updateInfo(res.id, newInfo)
    .then(result => {
        res.redirect('/profile');
    })
    .catch(err => {
        res.redirect('/500');
    })
});

router.get('/password', (req, res) => {
    res.render('password');
})

router.post('/password', (req, res) => {
    newPassword = req.body.new_password;
    oldPassword = req.body.old_password;
    confirmPassword = req.body.confirm_password;
    console.log("old_password: ", oldPassword);
    console.log("res.id: ", res.id);
    profileController.updatePassword(res.id, newPassword, oldPassword, confirmPassword)
    .then(result => {
        res.redirect('/auth/info');
    })
    .catch(err => {
        res.redirect('/500');
    })
});

module.exports = router;