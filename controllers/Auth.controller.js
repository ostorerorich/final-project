const { response } = require('express')
const passport = require('passport')

const Auth = require('../models/Auth.model')
const Posts = require('../models/Post.model')


//! Registar
const showAuthFormSignUp = (req, res = response) => {
    res.render('auth/signup')
}

const signup = async (req, res = response) => {
    const errors = []
    const { name, email, password, confirm_password } = req.body
    const avatar = `https://avatars.dicebear.com/api/bottts/${name}.svg`
    console.log(avatar)
    if (password !== confirm_password) {
        req.flash('error', 'Las contraseñas no coinciden')
        res.redirect('/auth/signup')
    }

    if (password.length < 8) {
        req.flash('error', 'La contraseña debe tener al menos 8 caracteres')
        res.redirect('/auth/signup')
    }



    const userFound = await Auth.findOne({ email })
    if (userFound) {
        req.flash('error', 'El mail ya existe en nuestro registros')
        return res.redirect('/auth/signup')
    }

    const newUser = new Auth({ name, email, password, avatar })
    newUser.password = await newUser.passwordEncrypt(password)
    await newUser.save()
    req.flash('success', 'Se registró correctamente')
    res.redirect('/auth/signin')
}


//! Login de usuario

const showAuthFormSignIn = (req, res = response) => {
    res.render('auth/signin')
}

const signin = passport.authenticate('local', {
    successRedirect: '/posts',
    successFlash: {
        type: 'success',
        message: 'Logeado'
    },
    failureRedirect: '/auth/signin',
    failureFlash: {
        type: 'error',
        message: 'Usuario o contraseña invalido'
    }
})


//! Logout
const logout = async (req, res = response, next) => {
    await req.logout((err) => {
        if (err) return next()
        req.flash('success', 'Session cerrada')
        res.redirect('/auth/signin')
    })
}



//! Ver perfil del usuario

const viewProfile = async (req, res = response) => {
    try {
        const userProfile = await Auth.findOne({ _id: req.params.id }).lean() // Me deja un obj puro de JS
        const userPost = await Posts.find({ user: req.params.id }).lean()

        const title = `User ${userProfile.name}`
        res.status(200).render('profile/profile', {
            userProfile,
            title,
            userPost
        })
    } catch (error) {
        console.log('Error Profile', error)
    }
}




//Exportacion de funciones

module.exports = {
    showAuthFormSignUp,
    signup,
    showAuthFormSignIn,
    signin,
    logout,
    viewProfile,
}