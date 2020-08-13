var express = require('express'),
    template = require('../lib/template'),
    auth = require('../lib/auth'),
    router = express.Router();

router.get('/', (request,response) => {
    // request.user로 로그인 판단
    if (request.user) {
        console.log('Username is ', request.user.email);
    }
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.success) {
        feedback = fmsg.success[0];
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <div style="color:blue">${feedback}</div>
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px;height:200px;display:block;margin-top:15px;"/>
        <p>Photo by David Dvořáček on Unsplash</p>
        `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(response, request)
    );
    response.send(html);
});

module.exports = router;