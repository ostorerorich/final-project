const express = require('express')
const routerPosts = express.Router()

const { getPosts, newPost, createPost, showPost, deletePost, showPostFormEdit } = require('../controllers/posts')

// Rutas de Index
routerPosts.get('/posts', getPosts)
routerPosts.get('/posts/new', newPost)
routerPosts.get('/posts/edit/:id', showPostFormEdit)
routerPosts.get('/posts/:slug', showPost)

routerPosts.post('/posts', createPost)

routerPosts.delete('/posts/:id', deletePost)


module.exports = {
    routerPosts
}