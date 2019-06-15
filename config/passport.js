var FacebookStrategy = require('passport-facebook').Strategy;
// Lấy thông tin những giá trị auth
var configAuth = require('./auth');
var userModel = require('../models/users.model');


module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        // điền thông tin để xác thực với Facebook.
        // những thông tin này đã được điền ở file auth.js
        clientID: configAuth.facebook.app_id,
        clientSecret: configAuth.facebook.app_secret,
        callbackURL: configAuth.facebook.call_back,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
    },
        // Facebook sẽ gửi lại chuối token và thông tin profile của user
        function (token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {
                // tìm trong db xem có user nào đã sử dụng facebook id này chưa
                userModel.getByFacebookID({ 'facebook_id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);
                    // Nếu tìm thấy user, cho họ đăng nhập
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // nếu chưa có, tạo mới user
                        console.log(profile);
                        var newUser = {
                            facebook_id: profile.id,
                            email: profile.emails[0].value,
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName
                        }
                        // // lưu các thông tin cho user
                        // newUser.facebook.id = profile.id;
                        // newUser.facebook.token = token;
                        // newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
                        // newUser.facebook.email = profile.emails[0].value; // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền
                        // lưu vào db
                        userModel.add(newUser)
                            .then()
                            .catch()
                    }
                });
            });
        }));
}