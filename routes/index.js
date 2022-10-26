const express = require('express')
const routerIndex = express.Router()

const { getRootController } = require('../controllers')

// Rutas de INDEX
routerIndex.get('/', getRootController)

module.exports = routerIndex