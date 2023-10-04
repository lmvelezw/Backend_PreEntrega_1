const { Router } = require("express");
const { cartsModel } = require("../models/carts.model.js");
const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    let carts = await cartsModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let cart = await cartsModel.find({ _id: id });
    res.send({ result: "success", payload: cart });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/", async (req, res) => {
  let result = await cartsModel.create({});
  res.send({ result: "success", payload: result });
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;
  
    try {
      if (!cid || !pid) {
        return res.send({ status: "error", error: "Missing product or cart" });
      }
  
      let cartExists = await cartsModel.findOneAndUpdate({ _cid: cid });
  
      if (cartExists) {
        let productInCart = cartExists.products.find(prod => prod.productId === pid);
  
        if (productInCart) {
          productInCart.quantity++; // Increment quantity if product exists in cart
        } else {
          // Add new product to cart if not found
          cartExists.products.push({ productId: pid, quantity: 1 });
        }
  
        let updatedCart = await cartExists.save();
  
        return res.send({
          result: "success",
          payload: updatedCart,
        });
      } else {
        // If cart does not exist, you might want to handle this case
        return res.send({ result: "error", error: "Cart not found" });
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: "error", error: "Internal server error" });
    }
  });

cartRouter.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let result = await cartsModel.deleteOne({ _id: id });
    res.send({ result: "success", payload: result });
  } catch (error) {
    return res.send({ status: "error", error: "Internal server error" });
  }
});

module.exports = cartRouter;
