const { response } = require("express");
const Post = require("../models/Post.model");
const Auth = require('../models/Auth.model')
const multer = require('multer')

//! Mostrar post en el home
const getPostMain = async (req, res = response) => {
  console.log(req.query.page)
  try {
    const posts = await Post.paginate({}, {
      page: req.query.page,
      limit: 6,
      sort: {createdAt: 'desc'}
    });
    const pages = posts.totalPages
    const upd = posts.docs
    const title = "InfoBlog - Inicio";
    res.status(200).render("home", {
      title,
      upd,
      pages
    });
  } catch (error) {
    console.log('Error INDEX', error)
  }
}

//! PANEL DE POSTS
const getPanelPost = async (req, res = response) => {
  try {
    const posts = await Post.find({user: req.user.id}).lean(); // Me deja un obj puro de JS
    //console.log(posts)
    const title = "InfoBlog - Listado de Post";
    res.status(200).render("panelPost", {
      title,
      posts,
    });
  } catch (error) {
    console.log('Error INDEX', error)
  }
};

//! VER POSTS
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    const userProfile = await Auth.findOne({_id: post.user}).lean();
    if (post === null) res.redirect("/");

    res.render("show", {
      title: `InfoBlog - ${post.title}`,
      post,
      userProfile
    })

  } catch (error) {
    console.log('Error SHOW' , error)
  }
};

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
          req.flash('error', "El titulo es demaciado largo")
          return res.redirect('/auth/signin')
        }

        if(req.file == undefined){
          image = '/uploads/none.jpg'
        }else {
          image = '/uploads/' + req.file.filename
        }

        console.log(req.file)
        const newPost = new Post({title, body, user: req.user.id, image})
        await newPost.save()

        res.redirect(`/posts/${newPost.slug}`)

    } catch (error) {
        console.log({error})
        req.flash('error', 'Ha ocurrido un error')
        return res.redirect('/')
    }
}

//! ELIMINAR POSTS
const deletePost = async (req, res = response) => {
  try {
      await Post.findByIdAndDelete(req.params.id)

      req.flash('success', 'Post eliminado correctamente')
      res.redirect('/posts')

  } catch (error) {
      console.log('Error DELETE', error)
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
  getPanelPost,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  getPostMain
};
