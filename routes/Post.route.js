const express = require('express')
const routerPosts = express.Router()

const {
    getPanelPost,
    newPost,
    createPost,
    showPost,
    deletePost,
    showPostFormEdit,
    getPostMain,
    editPost,
    createComment, 
    searchPost} = require('../controllers/Post.controller')
const isAuthenticated = require('../middlewares/isauthenticated')


//Obtener post para el home.hbs
routerPosts.get('/', getPostMain)
//Mostar panel
routerPosts.get('/posts', isAuthenticated, getPanelPost)

routerPosts.get('/posts/new', isAuthenticated, newPost)

routerPosts.get('/posts/edit/:id', isAuthenticated, showPostFormEdit)

routerPosts.post('/posts/edit/:id', isAuthenticated, editPost)

routerPosts.post('/post/:post/comment/:user/:slug', isAuthenticated, createComment)

routerPosts.get('/posts/:slug', showPost)

routerPosts.post('/posts', isAuthenticated, createPost)

routerPosts.delete('/posts/:id', isAuthenticated, deletePost)

routerPosts.get('/search/', searchPost)


module.exports = {
    routerPosts
}