const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const cookie = require('cookie');
const { constants } = require('crypto');

const db = {
  email: 'k@hj.com',
  password: '11111'
};

function authIsOwner(req) {
  let cookies = req.headers.cookie;
  if (cookies) cookies = cookie.parse(cookies);
  if (cookies.email === db.email && cookies.password === db.password) return true;
  return false;
}

function authStatusUI(isOwner) {
  if (isOwner) return '<a href="/logout_process">Logout</a>';
  return undefined;
}

function authChecker(response, isOwner) {
  if (!isOwner) {
    response.end('<a href="/login">go to Login</a>');
    return false;
  }
}

const app = http.createServer(function(request,response){
  const _url = request.url;
  let queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  const isOwner = authIsOwner(request);

    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          let title = 'Welcome';
          let description = 'Hello, Node.js';
          let list = template.list(filelist);
          let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`,
            authStatusUI(isOwner)
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          const filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            const title = queryData.id;
            let sanitizedTitle = sanitizeHtml(title);
            let sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            let list = template.list(filelist);
            let html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`,
                authStatusUI(isOwner)
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      authChecker(response, isOwner);
      fs.readdir('./data', function(error, filelist){
        const title = 'WEB - create';
        let list = template.list(filelist);
        let html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
        `, '', authStatusUI(isOwner));
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      authChecker(response, isOwner);
      let body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    }
    else if(pathname === '/update'){
      authChecker(response, isOwner);
      fs.readdir('./data', function(error, filelist){
        const filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          const title = queryData.id;
          const list = template.list(filelist);
          const html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
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
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
            authStatusUI(isOwner)
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
    else if(pathname === '/update_process'){
      authChecker(response, isOwner);
      let body = '';
      request.on('data', data => body += data );
      request.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
      });
    }
    else if(pathname === '/delete_process'){
      if (!isOwner) {
        response.end('<a href="/login">go to Login</a>');
        return false;
      }
      let body = '';
      request.on('data', data => body += data );
      request.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;
        const filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, error => {
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    } else if (pathname === '/login') {
      fs.readdir('./data', (error, filelist) => {
        const title = 'Login';
        const list = template.list(filelist);
        const html = template.HTML(title, list,
          `<form action='login_process' method='POST'>
            <p><input type='email' name='email' placeholder='email' /></p>
            <p><input type='password' name='password' placeholder='password' /></p>
            <button type='submit'>LOGIN</button>
           </form>`,
          `<a href='/create'>create</a>` 
        );
        response.writeHead(200);
        response.end(html);
      });
    } else if (pathname === '/login_process') {
        let body = '';
        request.on('data', data => body += data );
        request.on('end', () => {
          const post = qs.parse(body);
          if (post.email === 'k@hj.com' && post.password === '11111') {
            response.writeHead(302, {
              'Set-Cookie': [
                `email=${post.email}`,
                `password=${post.password}`,
                'nickname=khjcode',
              ],
              Location: '/'
            });
            response.end();
          } else {
            response.end('Error');
          }
        });
    } else if (pathname === '/logout_process') {
        let body = '';
        request.on('data', data => body += data );
        request.on('end', () => {
          response.writeHead(302, {
            'Set-Cookie': [
            'email=; Max-Age=0',
            'password=; Max-Age=0',
            'nickname=; Max-Age=0',
            ],
            Location: '/'
          });
          response.end();
        });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
