const fs = require("fs");
const { nanoid } = require("nanoid");
const ProductManager = require("./ProductManager.js");

const productAll = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }

  readCarts = async () => {
    const carts = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCarts = async (cart) => {
    await fs.promises.writeFile(this.path, JSON.stringify(cart));
  };

  exists = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id === id);
  };

  addCart = async () => {
    let oldCarts = await this.readCarts();
    let id = nanoid();
    let allCarts = [{ id: id, products: [] }, ...oldCarts];
    await this.writeCarts(allCarts);
    return "Cart added";
  };

  getCartByID = async (id) => {
    let cartExists = await this.exists(id);
    return !cartExists ? "Cart not found" : cartExists;
  };

  productToCart = async (cartID, productID) => {
    let cartExists = await this.exists(cartID);
    if (!cartExists) return "Cart not found";

    let productById = await productAll.exists(productID);
    if (!productById) return "Product not found";

    let allCarts = await this.readCarts();
    let cartFilter = allCarts.filter((cart) => cart.id != cartID);

    if (cartExists.products.some((prod) => prod.id === productID)) {
      let productInCart = cartExists.products.find(
        (prod) => prod.id === productID
      );
      productInCart.quantity++;
      let cartConcat = [cartExists, ...cartFilter];
      await this.writeCarts(cartConcat);
      return "In-cart product updated";
    }

    cartExists.products.push({ id: productById.id, quantity: 1 });
    let cartConcat = [cartExists, ...cartFilter];

    await this.writeCarts(cartConcat);
    return "Product was added to the cart";
  };
}

module.exports = CartManager;
