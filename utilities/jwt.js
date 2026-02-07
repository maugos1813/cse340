const jwt = require("jsonwebtoken")

/**
 * Create a JWT for an authenticated account
 */
function createJWT(account) {
  return jwt.sign(
    {
      account_id: account.account_id,
      account_type: account.account_type,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
}

/**
 * Verify JWT from cookie
 */
function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

/**
 * Middleware to protect routes
 */
function checkJWT(req, res, next) {
    const token = req.cookies?.jwt
    if (!token) {
      // Solo bloquea rutas sensibles, pero no fuerces login en cada navegación
      req.accountData = null
      return next()
    }
  
    try {
      const decoded = verifyJWT(token)
      req.accountData = decoded // datos disponibles en rutas y vistas
      next()
    } catch (error) {
      // Token inválido, limpiar cookie y permitir login de nuevo
      res.clearCookie("jwt")
      req.flash("notice", "Invalid session, please log in again.")
      return res.redirect("/account/login")
    }
  }
  

module.exports = {
  createJWT,
  verifyJWT,
  checkJWT,
}
