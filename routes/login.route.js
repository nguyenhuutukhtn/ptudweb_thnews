var express = require('express');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')

var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/LastestPost.mdw'))
router.use(require('../middlewares/FourLastestNews.mdw'))
router.use(require('../middlewares/TopThreeHot.mdw'))

router.post('/', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    console.log("email:", email);
    console.log("password: ", password);
    var site;
    authentication.login(email, password)
        .then(result => {
            res.cookie('Authorization', result[0], { maxAge: 900000 * 10, httpOnly: true });
            console.log("Success: ", result[0]);
            console.log("site: ", result[1]);
            res.redirect(result[1]);
        })
        .catch(err => {
            res.redirect('/401');
        })
})

router.get('/', (req, res) => {
    res.render('login');
})

module.exports = router;