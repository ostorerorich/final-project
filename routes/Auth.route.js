const express = require('express')
const { showAuthFormSignUp, signup, showAuthFormSignIn, signin, logout, viewProfile } = require('../controllers/Auth.controller')
const isAuthenticated = require('../middlewares/isauthenticated')
const routerAuth = express.Router()

// Routes

routerAuth.get('/auth/signup', showAuthFormSignUp)
routerAuth.post('/auth/signup', signup)

routerAuth.get('/auth/signin', showAuthFormSignIn)
routerAuth.post('/auth/signin', signin)

routerAuth.get('/auth/logout', isAuthenticated, logout)

routerAuth.get('/profile/:id', viewProfile)


module.exports = {
    routerAuth
}