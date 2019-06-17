var authentication = require('../controllers/authentication.controller')

module.exports = (req, res, next) => {
    var token = req.cookies['Authorization'];
    if (token == null) {
        console.log("Null token");
        res.render('login');
    } else {
        authentication.verify(token, res)
            .then(temp => {
                authentication.getPayLoadToken(token, res)
                    .then(temp => {
                        if (res.role === "editors") {
                            next();
                        } else {
                            console.log("You don't have this permission");
                            res.render('login');
                        }
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