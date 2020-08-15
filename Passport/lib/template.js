module.exports = {
  HTML: (title, list, body, control, authStatusUI='<a href="/auth/login">Login</a>') => {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    let list = '<ul>';
    let i = 0;
    while (i < filelist.length) {
      list += `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i += 1;
    }
    list += '</ul>';
    return list;
  }
}
