import { Product } from "../../domain/entities/product.entity";
import catalogPrisma from "../prisma/catalog.prisma";

class ProductRepository {
  private toProductEntity(data: { id: string; name: string; price: number }): Product {
    return new Product({
      id: data.id,
      name: data.name,
      price: data.price,
    });
  }

  async create(product: Product): Promise<Product> {
    const createdProduct = await catalogPrisma.product.create({
      data: {
        name: product.name,
        price: product.price,
      },
    });

    return this.toProductEntity(createdProduct);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const products = await catalogPrisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return products.map((product) => this.toProductEntity(product));
  }

  async findAll(): Promise<Product[]> {
    const products = await catalogPrisma.product.findMany();
    return products.map((product) => this.toProductEntity(product));
  }
}

const productRepository = new ProductRepository();

export { productRepository };
