var jwt = require('jsonwebtoken');
var fs = require("fs");

module.exports = {
    issue: (email, id, role) => {
        var privateKey = fs.readFileSync('private.key');
        return new Promise((resolve, reject) => {
            var token = jwt.sign({
                role: role,
                email: email,
                id: id,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                iat: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
            }, privateKey);
            console.log("Token 0: ", token);
            if (token != null){
                resolve(token);
            } else{
                reject("Error");
            }
        });
    },
    verify: (token, res) => {
        console.log(token)
        // verify a token asymmetric
        var privateKey = fs.readFileSync('private.key');
        jwt.verify(token, privateKey, function (err, decoded) {
            if (err != null) {
                res.err = 'Error';
            }
        });
    }
}