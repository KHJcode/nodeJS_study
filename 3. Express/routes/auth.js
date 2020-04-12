var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    sanitizeHtml = require('sanitize-html'),
    template = require('../lib/template'),
    router = express.Router();

var authData = {
    email:'khj0000@gmail.com',
    password:'0000',
    nickname:'khj'
}

router.get('/login', (request, response) => {
    var title = 'WEB - Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
});
/*
router.post('/login_process', (request,response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if (email === authData.email && password === authData.password) {
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(() => {
          response.redirect('/');
        });
    } else {
        response.send('Who?');
    }
  });
*/
router.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    response.redirect('/');
  });
});

module.exports = router;