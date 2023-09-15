const fs = require("fs");
const { nanoid } = require("nanoid");
const ProductManager = require("./ProductManager.js");

const productAll = new ProductManager();

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }

  errorValidation = async (error) => {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      return {
        statusCode: error.statusCode,
        message: error.message,
      };
    } else {
      throw error;
    }
  };

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
    try {
      let cartExists = await this.exists(id);
      if (!cartExists) {
        throw new NotFoundError("Cart not found");
      }
      return cartExists;
    } catch (error) {
      return await this.errorValidation(error);
    }
  };

  productToCart = async (cartID, productID) => {
    try {
      let cartExists = await this.exists(cartID);
      if (!cartExists) {
        throw new NotFoundError("Cart not found");
      }
      let productById = await productAll.exists(productID);
      if (!productById) {
        throw new NotFoundError("Product not found");
      }

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
    } catch (error) {
      return await this.errorValidation(error);
    }
  };
}

module.exports = CartManager;
