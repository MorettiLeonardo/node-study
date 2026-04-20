import { userRepository } from "@platform/database/repositories/user.repository";

type GetUserByIdResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

class GetUserByIdHandler {
  async execute(id: string): Promise<GetUserByIdResponse> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

const getUserByIdHandler = new GetUserByIdHandler();

export { getUserByIdHandler };
