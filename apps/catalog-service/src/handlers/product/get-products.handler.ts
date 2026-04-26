import { productRepository } from "../../database/repositories/product.repository";

export class GetProductsHandler {
  async execute() {
    return productRepository.findAll();
  }
}