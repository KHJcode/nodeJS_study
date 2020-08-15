function authStatusUI(req) {
  const logined = req.session.is_logined ? `<h3>Hello, ${req.session.nickname}!</h3><a href="/auth/logout">Logout</a>` : '<a href="/auth/login">Login</a>';
  return logined;
}

module.exports = authStatusUI;
