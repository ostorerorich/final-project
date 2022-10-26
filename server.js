// const app = require('express')()
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const { dbConnection } = require('./database/config')
const { engine } = require('express-handlebars')
const routerIndex = require('./routes')
const { routerDev } = require('./routes/db')
const { routerPosts } = require('./routes/posts')
const morgan = require('morgan') // Para visualizar los metodos HTTP en la consola
const app = express() // inicializando la apliacion de express



// Conectar a la base de datos de mongodb
dbConnection()

// Template Engine
app.engine('hbs', engine({extname: '.hbs'}))
app.set('view engine', 'hbs')
app.set('views', './views')

// Middlewares
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))



// Routes
app.use('/', routerIndex)
app.use('/', routerDev) // Solo para desarrollo
app.use('/', routerPosts)

const PORT = process.env.PORT
app.listen(PORT, err => {
    if ( err ) throw new Error('Ocurrió un problema con el servidor: ', err)
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
})
