const fs = require("fs");
const { nanoid } = require("nanoid");

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

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
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
    try {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.stock ||
        !product.category
      ) {
        throw new BadRequestError(
          "You didn't provide all of the required fields"
        );
      }

      // if (
      //   typeof product.title !== "string" ||
      //   typeof product.description !== "string" ||
      //   typeof product.code !== "string" ||
      //   typeof product.price !== "number" ||
      //   typeof product.stock !== "number" ||
      //   typeof product.category !== "string"
      // ) {
      //   throw new BadRequestError(
      //     "There is a field with error in the content type you are providing"
      //   );
      // }

      let oldProducts = await this.readProducts();
      product.id = nanoid();
      product.status = product.status || true;
      product.thumbnail = product.thumbnail || [];

      let allProducts = [...oldProducts, product];
      await this.writeProducts(allProducts);
      return "Product added";
    } catch (error) {
      return await this.errorValidation(error);
    }
  };

  getProducts = async () => {
    return await this.readProducts();
  };

  getProductsByID = async (id) => {
    try {
      let productExists = await this.exists(id);
      if (!productExists) {
        throw new NotFoundError("Product not found");
      }
      return productExists;
    } catch (error) {
      return await this.errorValidation(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.readProducts();
      let existingProduct = products.some((prod) => prod.id === id);
      if (existingProduct) {
        let filteredProducts = products.filter((prod) => prod.id !== id);
        this.writeProducts(filteredProducts);
        return "Deleted product";
      } else {
        throw new NotFoundError("Product not found");
      }
    } catch (error) {
      return await this.errorValidation(error);
    }
  };

  updateProduct = async (id, updateProduct) => {
    try {
      let productExists = await this.exists(id);

      if (!productExists) {
        throw new NotFoundError("Product not found");
      }

      let products = await this.readProducts();
      let filteredProducts = products.filter((prod) => prod.id !== id);

      let updatedProducts = [{ ...updateProduct, id: id }, ...filteredProducts];

      await this.writeProducts(updatedProducts);

      return "Product updated successfully";
    } catch (error) {
      return await this.errorValidation(error);
    }
  };
}

module.exports = ProductManager;
