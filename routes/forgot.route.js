var express = require('express');
var cookieParser = require('cookie-parser');
var authentication = require('../controllers/authentication.controller');

var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

router.get('/', (req, res) => {
    res.render('forgot');
})

router.post('/admin', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    console.log("email:", email);
    console.log("password: ", password);
    authentication.login(email, password)
        .then(token => {
            res.cookie('Authorization', token, { maxAge: 900000, httpOnly: true });
            console.log("Success: ", token);
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/401');
        })
})

router.post('/', (req, res) =>{

});

module.exports = router;