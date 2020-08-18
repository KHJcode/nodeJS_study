module.exports = app => {
  const authData = require('../config/authData');
  const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.email); // 식별자 값이 세션 데이터로 감.
  });

  passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    // id 의 값은 세션에 저장된 식별자의 값
    // id 값으로 사용자를 식별해서 사용자 데이터를 조회 및 제공.
    done(null, authData); // 이 예제에서는 조회 없이 그냥 제공.
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      console.log('passport', username, password);
      if (username === authData.email) {
        if (password === authData.password)  {
          return done(null, authData, { message : 'Welcome.' });
        } else {
          return done(null, false, { message : 'Incorrect user password' });
        }
      } else {
        return done(null, false, { message : 'Incorrect user email.' });
      }
    }
  ));
  return passport;
};
