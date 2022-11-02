const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'Acceso no autorizado')
    res.redirect('/auth/signin')

}

module.exports = isAuthenticated