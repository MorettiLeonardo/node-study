import { Product } from "src/domain/entities/product.entity";
import { productRepository } from "src/infrastructure/database/repositories/product.repository"
import z from "zod";

const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive()
})

type CreateProductRequest = z.infer<typeof createProductSchema>;

interface CreateProductResponse {
    product: Product;
}

export class CreateProductHandler {
    async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
        var parsed = createProductSchema.safeParse(request)

        if (!parsed.success) {
            throw new Error(parsed.error.message)
        }

        var newProduct = new Product(parsed.data)

        const product = await productRepository.create(newProduct);

        return { product }
    }
}

const createProductHandler = new CreateProductHandler();

export { createProductHandler }