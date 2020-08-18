function authStatusUI(req) {
  const logined = req.user ? `<h3>Hello, ${req.user.nickname}!</h3><a href="/auth/logout">Logout</a>` : '<a href="/auth/login">Login</a>';
  return logined;
}

module.exports = authStatusUI;
