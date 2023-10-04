const { Router } = require("express");
const { productModel } = require("../models/products.model.js");

const ProductRouter = Router();

ProductRouter.get("/", async (req, res) => {
  try {
    let products = await productModel.find();
    res.send({ result: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});

ProductRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let product = await productModel.find({ _id: id });
    res.send({ result: "success", payload: product });
  } catch (error) {
    console.log(error);
  }
});

ProductRouter.post("/", async (req, res) => {
  let { title, description, code, price, stock, category, image } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.send({ status: "error", error: "Incomplete data" });
  }
  let result = await productModel.create({
    title,
    description,
    code,
    price,
    stock,
    category,
    image
  });
  res.send({ result: "success", payload: result });
});

ProductRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let updateProduct = req.body;
  if (
    !updateProduct.title ||
    !updateProduct.description ||
    !updateProduct.code ||
    !updateProduct.price ||
    !updateProduct.stock ||
    !updateProduct.category
  ) {
    res.send({ status: "error", error: "Missing data for product" });
  }
  let result = await productModel.updateOne({ _id: id }, updateProduct);
  res.send({ result: "success", payload: result });
});

ProductRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let result = await productModel.deleteOne({ _id: id });
  res.send({ result: "success", payload: result });
});

module.exports = ProductRouter;