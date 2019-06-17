var express = require('express');
var articleModel = require('../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');

var guestRole = require('../middlewares/guestRole.mdw');
//var editorRole = require('../middlewares/editorRole.mdw');

const NodeCache = require("node-cache");
const myCache = new NodeCache();

// var fs = require("fs");
// var privateKey = fs.readFileSync('private.key');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../middlewares/FourLastestNews.mdw'));
router.use(require('../middlewares/EightPopularNews.mdw'));
router.use(require('../middlewares/TenTrendingTags.mdw'));
router.use(require('../middlewares/FiveTrendingTags.mdw'));
router.use(require('../middlewares/FiveLastestComment.mdw'));
router.use(require('../middlewares/TopEightHot.mdw'));
router.use(require('../middlewares/TopThreeHot.mdw'));
router.use(require('../middlewares/MostRecommend.mdw'));
router.use(require('../middlewares/TopFourRecommend.mdw'));
router.use(require('../middlewares/AnotherNews.mdw'))
router.use(require('../middlewares/HotInWeek.mdw'))
router.use(require('../middlewares/TopFiveCommonKeywords.mdw'))
router.use(require('../middlewares/feadturedWritter.mdw'))

router.use('/guest', guestRole);

router.get('/', (req, res) => {
    value = myCache.get("token");
    console.log(value);
    if (value == undefined) {
        // handle miss!
        console.log("Empty cache");
    } else {
        console.log("token cookies : ", value);
        res.cookie('Authorization', value, { maxAge: 900000, httpOnly: true });
    }
    var p = articleModel.all();
    p.then(rows => {
        res.render('home')
        //console.log(rows);
    }).catch(err => {
        console.log(err);
    });
})

router.post('/logout', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, res)
        .then(temp => {
            res.clearCookie('Authorization');
            value = myCache.del("token");
            res.render('home');
            res.redirect('/');
        })
        .catch(err => {
            res.render('401');
        })
})

module.exports = router;