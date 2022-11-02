const { response } = require('express')
const Post = require('../models/Post.model')
const Auth = require('../models/Auth.model')
const Comment = require('../models/Comment.model')

//! Mostrar post en el home
const getPostMain = async (req, res = response) => {

  try {
    const posts = await Post.paginate({}, {
      page: req.query.page,
      limit: 6,
      sort: {createdAt: 'desc'}
    })
    const pages = posts.totalPages
    const postResult = posts.docs
    const title = 'SBlog - Inicio'
    res.status(200).render('home', {
      title,
      postResult,
      pages
    })
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/')
  }
}


const searchPost = async (req, res = response) => {
  try {
    console.log(req.query.search)
    const result = await Post.find({title: {$regex: '.*' + req.query.search +'.*', $options:'i'}}).lean()
    res.status(200).render('search',{
      result
    })
  } catch (error) {
    console.log(error)
  }
}

//! PANEL DE POSTS
const getPanelPost = async (req, res = response) => {
  try {
    const posts = await Post.find({user: req.user.id}
    ).sort({createdAt: 'desc'}).lean() // Me deja un obj puro de JS

    const title = 'SBlog - Panel'
    res.status(200).render('panelPost', {
      title,
      posts,
    })
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/')
  }
}

//! VER POSTS
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean()
    const userProfile = await Auth.findOne({_id: post.user}).lean()
    const comments = await Comment.find({postId: post._id}).lean()

    if (post === null) res.redirect('/')

    res.render('show', {
      title: `SBlog - ${post.title}`,
      post,
      userProfile,
      comments
    })

  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

//! RENDER DEL NEW PSOT
const newPost = (req, res = response) => {
    res.status(200).render('new')
}

//!CREAR POST
const createPost = async (req, res = response) => {
    try {
        let  {title, body} = req.body
        let image
        
        if(title.length > 36){
          req.flash('error', 'El titulo es demaciado largo')
          return res.redirect('/auth/signin')
        }

        if(req.file == undefined){
          image = '/uploads/none.jpg'
        }else {
          image = '/uploads/' + req.file.filename
        }

        const newPost = new Post({title, body, user: req.user.id, image})
        await newPost.save()

        res.redirect(`/posts/${newPost.slug}`)

    } catch (error) {
        req.flash('error', 'Ha ocurrido un error')
        return res.redirect('/')
    }
}

const createComment = async (req, res = response) => {
  try {
    let { comment } = req.body

    console.log(req.params)
    console.log(req.body)
    const newComment = new Comment({author: req.params.user, comment, postId: req.params.post})
    await newComment.save()
    req.flash('success', 'Comentario agregado')
    res.redirect(`/posts/${req.params.slug}`)
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect(`/posts/${req.params.slug}`)
  }
}

//! ELIMINAR POSTS
const deletePost = async (req, res = response) => {
  try {
      await Post.findByIdAndDelete(req.params.id)

      req.flash('success', 'Post eliminado correctamente')
      res.redirect('/posts')

  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

// Show Post Form Edit

const showPostFormEdit = async (req, res = response) => {

    try {
        const postEdit = await Post.findById(req.params.id).lean()

        res.render('edit', {
            title: 'Editando Post',
            postEdit
        })
        
    } catch (error) {
      req.flash('error', 'Ocurrio un error')
      res.redirect('/')
    }
}

const editPost = async (req, res = response) => {
  try {
    const { title, body } = req.body

    const result = await Post.findByIdAndUpdate(req.params.id, {title, body})
    req.flash('success', 'Post Editado')
    res.redirect('/posts')
  }catch(error){
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

module.exports = {
  getPanelPost,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  getPostMain,
  editPost,
  createComment,
  searchPost
}
