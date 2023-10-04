const mongoose = require("mongoose")

const productCollection = 'products'

const productSchema = new mongoose.Schema({

    title: {type: String, max:20, required:true},
    description: {type: String, require:true},
    code: {type: String, require:true},
    price: {type: Number, require:true},
    stock: {type: Number, require:true},
    category: {type: String, max:20, require:true}

})

const productModel = mongoose.model(productCollection,productSchema)

module.exports = {productModel}