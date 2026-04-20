import { productRepository } from "@platform/database/repositories/product.repository";
import { publishEvent } from "@platform/messaging/kafka/client";
import { Product } from "@shared/domain/entities/product.entity";
import z from "zod";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
});

type CreateProductRequest = z.infer<typeof createProductSchema>;

interface CreateProductResponse {
  product: Product;
}

export class CreateProductHandler {
  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const parsed = createProductSchema.safeParse(request);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const newProduct = new Product(parsed.data);

    const product = await productRepository.create(newProduct);

    await publishEvent(
      "product.created",
      "ProductCreated",
      {
        id: product.id!,
        name: product.name,
        price: product.price,
      },
      product.id!,
    );

    return { product };
  }
}

const createProductHandler = new CreateProductHandler();

export { createProductHandler };
