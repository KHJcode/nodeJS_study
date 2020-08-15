const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

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
