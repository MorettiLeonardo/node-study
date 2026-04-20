import { Product as PrismaProduct } from "@prisma/client";
import prisma from "../prisma/prisma";
import { Product } from "../../../domain/entities/product.entity";

class ProductRepository {
    private toProductEntity(data: PrismaProduct): Product {
        return new Product({
            id: data.id,
            name: data.name,
            price: data.price,
        });
    }

    async create(product: Product): Promise<Product> {
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                price: product.price
            }
        });

        return this.toProductEntity(createdProduct);
    }
}

var productRepository = new ProductRepository();

export { productRepository }