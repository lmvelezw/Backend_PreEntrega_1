const fs = require("fs");
const { nanoid } = require("nanoid");

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }

  readProducts = async () => {
    const products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProducts = async (product) => {
    await fs.promises.writeFile(this.path, JSON.stringify(product));
  };

  exists = async (id) => {
    let products = await this.readProducts();
    return products.find((prod) => prod.id === id);
  };

  addProducts = async (product) => {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      throw new Error("You didn't provide all of the required fields");
    }

    if (
      typeof product.title !== "string" ||
      typeof product.description !== "string" ||
      typeof product.code !== "string" ||
      typeof product.price !== "number" ||
      typeof product.stock !== "number" ||
      typeof product.category !== "string"
    ) {
      throw new Error(
        "There is a field with error in the content type you are providing"
      );
    }

    let oldProducts = await this.readProducts();
    product.id = nanoid();
    product.status = product.status || true;
    product.thumbnail = product.thumbnail || [];

    let allProducts = [...oldProducts, product];
    await this.writeProducts(allProducts);
    return "Product added";
  };

  getProducts = async () => {
    return await this.readProducts();
  };

  getProductsByID = async (id) => {
    let productExists = await this.exists(id);
    return !productExists ? "Product not found" : productExists;
  };

  deleteProduct = async (id) => {
    let products = await this.readProducts();
    let existingProduct = products.some((prod) => prod.id === id);
    if (existingProduct) {
      let filteredProducts = products.filter((prod) => prod.id !== id);
      this.writeProducts(filteredProducts);
      return "Deleted product";
    } else {
      return "Product not found";
    }
  };

  updateProduct = async (id, updateProduct) => {
    let productExists = await this.exists(id);

    if (!productExists) return "Product not found";

    let products = await this.readProducts();
    let filteredProducts = products.filter((prod) => prod.id !== id);

    let updatedProducts = [{ ...updateProduct, id: id }, ...filteredProducts];

    await this.writeProducts(updatedProducts);

    return "Product updated successfully";
  };
}

module.exports = ProductManager;
