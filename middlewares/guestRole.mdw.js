var authentication = require('../controllers/authentication.controller')

module.exports = (req, res, next) => {
    var token = req.cookies['Authorization'];
    console.log("Token middleware: ", token);
    if (token == null) {
        console.log("Null token");
        res.render('login');
    } else {
        authentication.verify(token, res)
            .then(temp => {
                authentication.getPayLoadToken(token, res)
                    .then(temp => {
                        res.locals.role="guests";
                        console.log("guests role");
                        console.log("res.id: ", res.id);
                        next();
                    })
                    .catch(err => {
                        res.render('500');
                    })
            })
            .catch(err => {
                console.log("Token is invalid");
                res.render('login');
            })
    }
}