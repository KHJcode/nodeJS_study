const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  session = require('express-session'),
  FileStore = require('session-file-store')(session),
  indexRouter = require('./routes/index'),
  topicRouter = require('./routes/topic'),
  authRouter = require('./routes/auth');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());
app.use(session({
  HttpOnly: true, // JS를 통해서는 세션 쿠키를 사용할 수 없도록 강제함.
  //secure: true, // https 에서만 세션 정보를 주고 받을 수 있도록 처리.
  secret: 'dfsdfasfasdfdfefs',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var authData = {
  email:'khj0000@gmail.com',
  password:'0000',
  nickname:'khj'
}

app.use(passport.initialize());
app.use(passport.session()); // passport 에서 session 을 쓰겠다고 선언.

passport.serializeUser((user, done) => {
  console.log('serializeUser',user);
  done(null, user.email); // 식별자를 줌.
});

passport.deserializeUser((id, done) => {  // 저장소에서 사용자의 실제 데이터를 가져옴.
  console.log('deserializeUser',id); // id 값으로 ( 식별자 ) 사용자의 정보를 조회.
  done(null, authData);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (username, password, done) => {
    console.log('LocalStrategy', username, password);
    if (username === authData.email) {
      console.log(1);
      if (password === authData.password) {
        console.log(2);
        return done(null, authData);
      } else {
        console.log(3);
        return done(null, false, {
          message: 'Incorrect password'
        });
      }
    } else {
      console.log(4);
      return done(null, false, {
        message: 'Incorrect username'
      });
    }
  }
));


app.post('/auth/login_process',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/auth/login' 
  }));


app.get('*', (request, response, next) => { 
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next(); 
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((request,response,next) => {
  response.status(404).send("Sorry, cannot find this page.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));