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
router.use(require('../middlewares/ChildrenOfNews.mdw'))
router.use(require('../middlewares/ChildrenOfReader.mdw'))

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

router.get('/500', (req, res) => {
    res.render('500')
})

router.get('/401', (req, res) => {
    res.render('401')
})

router.get('/404', (req, res) => {
    res.render('404')
})

router.get('/403', (req, res) => {
    res.render('403')
})

router.get('/503', (req, res) => {
    res.render('503')
})

router.post('/logout', (req, res) => {
    var token = req.cookies['Authorization'];
    authentication.verify(token, res)
        .then(temp => {
            res.clearCookie('Authorization');
            value = myCache.del("token");
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/401');
        })
})

module.exports = router;