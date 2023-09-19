const express = require("express");
const ProductRouter = require("./router/product.routes.js");
const CartRouter = require("./router/cart.routes.js");
const { engine } = require("express-handlebars");
const path = require("path");
const { Server } = require("socket.io");
const ProductManager = require("./controllers/ProductManager.js");

const product = new ProductManager();

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () =>
  console.log(`Servidor en puerto ${PORT}`)
);

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// let productsList = product.getProducts()

io.on('connection', (socket) => {
  socket.emit("message",)
  console.log("Cliente conectado")
})

app.get("/", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("home", {
    title: "Products",
    products: allProducts,
  });
});

app.get("/realtimeproducts", async (req,res) => {
  let allProducts = await product.getProducts();
  res.render('realTimeProducts', {
    title: "Products",
    products: allProducts,  
  })
})

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
