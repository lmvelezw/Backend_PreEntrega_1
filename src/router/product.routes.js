const { Router } = require("express")
const ProductManager = require("../controllers/ProductManager.js")

const ProductRouter = Router()
const product = new ProductManager()

ProductRouter.get("/", async(req,res) => {
    let limit = parseInt(req.query.limit);
    let allProducts = await product.getProducts();
    !limit ? res.send(allProducts) : res.send(allProducts.slice(0, limit));
})

ProductRouter.get("/:id", async(req,res) => {
    res.send(await product.getProductsByID(req.params.id))
})

ProductRouter.post("/", async(req,res) => {
    let newProduct = req.body
    res.send(await product.addProducts(newProduct))
})

ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProduct = req.body
    res.send(await product.updateProduct(id, updateProduct))
})

ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProduct(id))
})

module.exports = ProductRouter