const { Router } = require("express")
const CartManager = require("../controllers/CartManager.js")

const CartRouter = Router()
const carts = new CartManager

CartRouter.post("/", async(req, res) => {
    res.send(await carts.addCart())
})

CartRouter.get("/", async(req,res) => {
    res.send(await carts.readCarts())
})

CartRouter.get("/:id", async(req,res) => {
    res.send(await carts.getCartByID(req.params.id))
})

CartRouter.post("/:cid/product/:pid", async(req,res) => {
    let cartID = req.params.cid
    let productID = req.params.pid

    res.send(await carts.productToCart(cartID, productID))

})

module.exports = CartRouter