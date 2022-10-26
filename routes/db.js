const express = require('express')
const routerDev = express.Router()

const Post = require('../models/posts')

const { generatePost } = require('../helpers/posts')

// TODO: Llevar esto a un controlador
routerDev.get('/db/fresh', async (req, res = express.response) => {
    
    try {

        const posts = await Post.deleteMany()
        //console.log(posts)

        for (let i = 0; i < 20; i++) {
            const nuevoPost = generatePost()
            const post = new Post(nuevoPost)

            await post.save()
        }       

        res.send('Todo OK')

    } catch (error) {
        console.log(error)
        res.send('Todo ERROR')
    }   

})

module.exports = {
    routerDev
}