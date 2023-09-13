const express = require("express")
const ProductRouter = require("./router/product.routes")
const CartRouter = require("./router/cart.routes")

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))