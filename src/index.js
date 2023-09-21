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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("home", {
    title: "Products with Handlebars",
    products: allProducts,
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", async (newEntry) => {
    console.log("Received new product data from client:", newEntry);
    console.log("Added new product to array:", newEntry);
    await product.addProducts(newEntry);
    io.emit("success", "Nuevo producto recibido desde el cliente.");
  });
});

app.get("/realtimeproducts", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("realtimeproducts", {
    title: "Products with Websocket",
    products: allProducts
  });
});

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
