var express = require('express'),
    template = require('../lib/template'),
    router = express.Router();

module.exports = function (passport) {
  router.get('/login', (request, response) => {
    var fmsg = request.flash(),
      feedback  = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    console.log(fmsg);
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
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
  
  router.post('/login_process',
    passport.authenticate('local', { 
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
  }));
  
  router.get('/logout', (request, response) => {
    request.logout();/*
    request.session.destroy((err) => {
      response.redirect('/');
    });
    */
    request.session.save(() => {  // 새로운 정보를 세션에 저장.
    response.redirect('/');
   });
  });
  return router;
}