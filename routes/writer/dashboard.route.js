var express = require('express');
var articleModel = require('../../models/article.model');
var cookieParser = require('cookie-parser')
var authentication = require('../../controllers/authentication.controller')
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
//var session = require('express-session');
var flash = require('connect-flash');
var subscriber = require('../../controllers/subscriber.controller');

var fs = require("fs");
var privateKey = fs.readFileSync('private.key');

//router.use(session({secret: privateKey}));
router.use(passport.initialize());
//router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser())
router.use(bodyParser.json());

router.use(require('../../middlewares/GetAllCategory.mdw'))

var writerRole = require('../../middlewares/writerRole.mdw')
router.use('/', writerRole);

router.get('/', (req, res) => {
    res.render('main_writer')
})
router.post('/new_post',(req,res)=>{
    console.log(req.body);
    var title=req.body.title;
    var category=req.body.category;
    var summary=req.body.summary;
    var thumbnail=req.body.thumbnail;
    var content=req.body.editor1;
    var tags=req.body.tags;
    console.log('Success');
    res.redirect('/auth/writer');
})

module.exports = router;