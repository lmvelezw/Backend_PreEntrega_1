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
app.use("/", express.static(__dirname + "/public"));

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

app.get("/realtimeproducts", async (req, res) => {
  let allProducts = await product.getProducts();
  res.render("realtimeproducts", {
    title: "Products with Websocket",
    products: allProducts,
  });
});

io.on("connection", async (socket) => {
  console.log(`Client ${socket.id} in`);

  let products = await product.getProducts();
  socket.emit("allProducts", products);

  socket.on("newProduct", async (data) => {
    console.log("Received new product data from client:", data);
    try {
      let addition = await product.addProducts(data);
      io.sockets.emit("success", addition);
      console.log("Product added to list");
    } catch (error) {
      return error;
    }
  });

  socket.on("deleteProduct", async (data) => {
    console.log("Deleting Product ID ", data);
    await product.deleteProduct(data);
    try {
      let updatedProducts = await product.getProducts()
      io.sockets.emit("deletedProduct", updatedProducts);
      console.log("Product was deleted");
    } catch (error) {
      return error;
    }
  });
});

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
