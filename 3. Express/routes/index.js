var express = require('express'),
    template = require('../lib/template'),
    auth = require('../lib/auth'),
    router = express.Router();

router.get('/', (request,response) => {
    console.log('/', request.user);
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px;height:200px;display:block;margin-top:15px;"/>
        <p>Photo by David Dvořáček on Unsplash</p>
        `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(response, request)
    );
     response.send(html);
});

module.exports = router;