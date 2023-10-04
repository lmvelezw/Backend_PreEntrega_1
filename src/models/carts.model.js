const mongoose = require("mongoose")

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {type: Array},
    total: {type: Number}

})

const cartsModel = mongoose.model(cartCollection,cartSchema)

module.exports = {cartsModel}