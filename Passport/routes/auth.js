const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const authData = require('../config/authData');

router.get('/login', (request, response) => {
  const title = 'WEB - Login';
  const list = template.list(request.list);
  const html = template.HTML(title, list, `
    <form action="/auth/login_process" method="POST">
      <h2>Login</h2>
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="password" placeholder="password"></p>
      <button type="submit">submit</button>
    </form>
  `, '');
  response.send(html);
});

router.post('/login_process', (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  if (email === authData.email && password === authData.password) {
    req.session.is_logined = true;
    req.session.nickname = authData.nickname;
    req.session.save(() => res.redirect('/'));
  }
  else {
    res.send('Who?');
  }
});

router.get('/logout', (req, res) => req.session.destroy(err => res.redirect('/')));

module.exports = router;
