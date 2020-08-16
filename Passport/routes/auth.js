const express = require('express');
const router = express.Router();
const template = require('../lib/template');

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

router.get('/logout', (req, res) => req.session.destroy(err => res.redirect('/')));

module.exports = router;
