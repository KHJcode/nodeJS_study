const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  indexRouter = require('./routes/index'),
  topicRouter = require('./routes/topic');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());
app.get('*', (request, response, next) => { 
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next(); 
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use((request,response,next) => {
  response.status(404).send("Sorry, cannot find this page.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));