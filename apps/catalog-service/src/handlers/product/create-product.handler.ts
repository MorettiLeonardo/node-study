import { productRepository } from "../../database/repositories/product.repository";
import { Product } from "../../domain/entities/product.entity";
import { publishEvent } from "../../messaging/kafka/client";
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
