const { User } = require('../models/User');

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;
    // 클라이언트 쿠키에서 토큰을 가져온다.
    
    // 토큰을 디코딩(복호화) 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});
        // 유저가 있으면 인증 완료, 없다면 인증 실패.
        req.token = token;
        req.user = user;
        next();
    })

};

module.exports = { auth };