module.exports = function(app){
    const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

    const authData = {
        email:'khj0000@gmail.com',
        password:'0000',
        nickname:'khj'
    };

    app.use(passport.initialize());
    app.use(passport.session()); // passport 에서 session 을 쓰겠다고 선언.
    
    passport.serializeUser((user, done) => { 
      // 최초 로그인 성공했을 때 사용자의 식별자를 세션 스토어에 저장.
      done(null, user.email); // 식별자를 줌.
    });
    
    passport.deserializeUser((id, done) => {  // 저장소에서 사용자의 실제 데이터를 가져옴.
      // 페이지에 방문할 때 마다 id 값으로 ( 여기서는 식별자 ) 필요한 사용자의 정보를 조회.
      done(null, authData); // 2번째 인자로 전달한 authData 는 request.user 에 주입됨.
    });
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      (username, password, done) => {
        if (username === authData.email) {
          if (password === authData.password) {
            return done(null, authData); // authData 는 passport.serializeUser 객체의 user 값이 됨.
          } else {
            console.log('Password is false.');
            return done(null, false, {
              message: 'Incorrect password'
            });
          }
        } else {
          console.log('This email is not found.');
          return done(null, false, {
            message: 'Incorrect username'
          });
        }
      }
    ));
    return passport;
}