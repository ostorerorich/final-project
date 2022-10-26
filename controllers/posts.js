const { response } = require('express')
const Post = require('../models/posts')

// INDEX
const getPosts = async (req, res = response) => {
  try {
    const posts = await Post.find({}).lean() // Me deja un obj puro de JS
    const title = 'InfoBlog - Listado de Post'

    res.status(200).render('index', {
      title,
      posts,
    })
  } catch (error) {
    console.log('Error INDEX', error)
  }
}

// SHOW
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean()
    if (post === null) res.redirect('/')

    res.render('show', {
      title: `InfoBlog - ${post.title}`,
      post,
    })

  } catch (error) {
    console.log('Error SHOW' , error)
  }
}

// DELETE
const deletePost = async (req, res = response) => {
    try {
        await Post.findByIdAndDelete(req.params.id)

        res.redirect('/posts')

    } catch (error) {
        console.log('Error DELETE', error)
    }
}

// NEW
const newPost = (req, res = response) => {
    res.status(200).render('new')
}

// CREATE
const createPost = async (req, res = response) => {

    try {
        // console.log(req.body)
        let post = new Post()

        post.title = req.body.title
        post.body = req.body.body

        post = await post.save()
        res.redirect(`/posts/${post.slug}`)

    } catch (error) {
        console.log('Error CREATE', error)
    }
}

// Show Post Form Edit

const showPostFormEdit = async (req, res = response) => {

    try {
        const post = await Post.findById(req.params.id).lean()

        res.render('edit', {
            title: 'Editando Post',
            post
        })
        
    } catch (error) {
        console.log('Show Edit Post', error)
    }
}

module.exports = {
  getPosts,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit
}
