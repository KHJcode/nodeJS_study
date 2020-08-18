const express = require('express');
const router = express.Router();
const template = require('../lib/template');

module.exports = passport => {
  router.get('/login', (request, response) => {
    const fmsg = request.flash();
    const title = 'WEB - Login';
    const list = template.list(request.list);
    const html = template.HTML(title, list, `
      <h1>${fmsg.error ? fmsg.error[0] : '' }</h1>
      <form action="/auth/login_process" method="POST">
        <h2>Login</h2>
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <button type="submit">submit</button>
      </form>
    `, '');
    response.send(html);
  });
  
  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true,
    })
  );
  
  router.get('/logout', (req, res) => {
    req.logout();
    req.session.save(() => res.redirect('/'));
  });
  
  return router;
}
