const { response } = require('express')
const { statusModel } = require("../models")

const getRootController = (req, res = response) => {
    res.status(200).send(statusModel)
}

module.exports = {
    getRootController
}