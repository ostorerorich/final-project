const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
require('dotenv').config()
require('./config/Passport.config')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')


const PORT = process.env.PORT
const app = express()

const { dbConnection } = require('./config/DBConnection.config')
const { routerAuth } = require('./routes/Auth.route')
const { routerDev } = require('./routes/db')
const { routerPosts } = require('./routes/Post.route')

// Inicializo la aplicación de express

// Conectar a la DB
dbConnection()

// Template Engine VER HANDLEBARS
app.engine('hbs', engine({
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.set('views', './views')

// Middlewares Express
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL})
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Declaro el nombre y el destino de las imagenes
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb, filename) =>{
        cb(null, uuid.v4() + path.extname(file.originalname))
    }
})
app.use(multer({
    storage: storage
}).single('image'))


//Hago publica la carpeta de img
app.use('/uploads', express.static('uploads'))

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})


// Routes
app.use('/', routerAuth)
app.use('/', routerDev) // Solo para desarrollo
app.use('/', routerPosts)

app.use((req, res) => {
    res.status(404).render('404', {title: '404 - Ruta no encontrada'})
})


app.listen(PORT, err => {
    if ( err ) throw new Error(`Ocurrió un problema con el servidor:` , err)
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
})
