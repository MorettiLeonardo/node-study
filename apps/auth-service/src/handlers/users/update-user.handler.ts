import { Role } from "@prisma/client";
import { userRepository } from "../../database/repositories/user.repository";
import { publishEvent } from "../../messaging/kafka/client";
import z from "zod";

const updateUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  role: z.nativeEnum(Role),
});

type UpdateUserRequest = z.infer<typeof updateUserSchema>;

type UpdateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

class UpdateUserHandler {
  async execute(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
    const parsed = updateUserSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error("Invalid data: " + parsed.error.message);
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const emailExists = await userRepository.findByEmail(data.email);

    if (emailExists && emailExists.id !== id) {
      throw new Error("Email já em uso");
    }

    const updatedUser = await userRepository.update(id, data);

    await publishEvent(
      "user.updated",
      "UserUpdated",
      {
        id: updatedUser.id!,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      updatedUser.id!,
    );

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}

const updateUserHandler = new UpdateUserHandler();

export { updateUserHandler };
