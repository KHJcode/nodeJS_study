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
  secure: true, // https 에서만 세션 정보를 주고 받을 수 있도록 처리.
  secret: 'dfsdfasfasdfdfefs',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
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