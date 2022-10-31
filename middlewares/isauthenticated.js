const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('todo_error', "Acceso no autorizado")
    res.redirect('/auth/signin')

}

module.exports = isAuthenticated