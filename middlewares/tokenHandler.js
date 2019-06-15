var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var fs = require("fs");

module.exports = {
    issue: async (req, res) => {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var user = {
            email: req.body.email,
            password: hashedPassword,
        };
        var privateKey = fs.readFileSync('private.key');
        var token = jwt.sign({
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            iat: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        }, privateKey);
        res.token = token;
        res.email = user.email;
        res.cook
        return true;
    },
    verify: (req, res, token) => {
        console.log(token)
        // verify a token asymmetric
        var privateKey = fs.readFileSync('private.key');
        jwt.verify(token, privateKey, function (err, decoded) {
            if (err == null) {
                console.log(decoded);
                console.log(decoded.email);
            } else {
                res.err = 'Error';
            }
        });
    }
}