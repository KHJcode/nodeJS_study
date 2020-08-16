const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const authData = require('./config/authData');

const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  HttpOnly: true, // JavaScript 로 session 쿠키 탈취 방지.
  secret: 'khj@$#$#@$#$#@$#$#', // true 로 설정하면 https 에서만 사용자 정보 주고받기 가능.
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.email); // 식별자 값이 세션 데이터로 감.
});

passport.deserializeUser((id, done) => {
  // id 의 값은 세션에 저장된 식별자의 값
  console.log('deserializeUser', id);
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
      console.log(1);
      if (password === authData.password)  {
        console.log(2);
        return done(null, authData);
      } else {
        console.log(3);
        return done(null, false, { message : 'Incorrect user password' });
      }
    } else {
      console.log(4);
      return done(null, false, { message : 'Incorrect user email.' });
    }
  }
))

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
);


app.get('*', (request, response, next) => {
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, console.log('Example app listening on port 3000!'));
