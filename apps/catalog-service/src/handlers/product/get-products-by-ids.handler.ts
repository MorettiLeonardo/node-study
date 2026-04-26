import { productRepository } from "../../database/repositories/product.repository";
import z from "zod";

const getProductsByIdsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

type GetProductsByIdsRequest = z.infer<typeof getProductsByIdsSchema>;

class GetProductsByIdsHandler {
  async execute(request: GetProductsByIdsRequest) {
    const parsed = getProductsByIdsSchema.safeParse(request);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    return productRepository.findByIds(parsed.data.ids);
  }
}

const getProductsByIdsHandler = new GetProductsByIdsHandler();

export { getProductsByIdsHandler };
