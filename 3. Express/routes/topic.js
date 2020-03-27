  var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    sanitizeHtml = require('sanitize-html'),
    template = require('../lib/template'),
    router = express.Router();

  router.get('/create', (request, response) => {
    var title = 'WEB - Create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    response.send(html);
  });
  
  router.post('/create_process', (request,response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var findCreate = title.indexOf('create'),
      findUpdate = title.indexOf('update'),
      findDelete = title.indexOf('delete');
    if (findDelete != -1 || findUpdate != -1 || findCreate != -1) {
      title = 'Error - You cannot use this title.';
    }
    fs.writeFile(`data/${title}`, description, 'utf8', err => {
      response.redirect(`/topic/${title}`);
    });
  });
  
  router.get('/update/:pageId', function(request,response){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      response.send(html);
    });
  });
  
  router.post('/update_process', (request, response) => {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var findCreate = title.indexOf('create'),
      findUpdate = title.indexOf('update'),
      findDelete = title.indexOf('delete');
    if (findDelete != -1 || findUpdate != -1 || findCreate != -1) {
      title = 'Error - You cannot use this title.';
    }
    fs.rename(`data/${id}`, `data/${title}`, error => {
      fs.writeFile(`data/${title}`, description, 'utf8', err => {
        response.redirect(`/topic/${title}`);
      });
    });
  });
  
  router.post('/delete_process', (request,response) => {
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, error => {
      response.redirect(`/`);
    });
  });
  
  router.get('/:pageId', (request, response, next) => { 
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      if(err){
        next(err);
      } else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1','h2','h3','h4','h5','h6']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
      }
    });
  });
module.exports = router;