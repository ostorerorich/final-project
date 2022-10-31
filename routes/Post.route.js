const express = require('express')
const routerPosts = express.Router()

const { 
    getPanelPost,
    newPost,
    createPost,
    showPost,
    deletePost,
    showPostFormEdit,
    getPostMain } = require('../controllers/Post.controller')
const isAuthenticated = require('../middlewares/isauthenticated')


//Obtener post para el home.hbs
routerPosts.get('/', getPostMain)

routerPosts.get('/posts', isAuthenticated, getPanelPost)

routerPosts.get('/posts/new', isAuthenticated, newPost)
routerPosts.get('/posts/edit/:id', isAuthenticated, showPostFormEdit)
routerPosts.get('/posts/:slug', showPost)

routerPosts.post('/posts', isAuthenticated, createPost)

routerPosts.delete('/posts/:id', isAuthenticated, deletePost)


module.exports = {
    routerPosts
}