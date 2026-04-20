import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { publishEvent } from "@platform/messaging/kafka/client";
import { mailQueue } from "@platform/messaging/queues/mail.queue";
import { userRepository } from "@platform/database/repositories/user.repository";
import { User } from "@shared/domain/entities/user.entity";
import z from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateUserRequest = z.infer<typeof createUserSchema>;

type CreateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: Date;
};

export class CreateUserHandler {
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const parsed = createUserSchema.safeParse(request);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const existingUser = await userRepository.findByEmail(parsed.data.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hash = await bcrypt.hash(parsed.data.password, 10);

    const user = new User({
      name: parsed.data.name,
      email: parsed.data.email,
      password: hash,
      role: Role.USER,
    });

    const createdUser = await userRepository.create(user);

    const mailData = {
      to: user.email,
      subject: "Welcome to our platform!",
      text: `Hello ${user.name}, welcome to our platform! Your account has been created successfully.`,
    };

    await mailQueue.add("send-registration-email", mailData);

    await publishEvent(
      "user.created",
      "UserCreated",
      {
        id: createdUser.id!,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        createdAt: createdUser.createdAt?.toISOString(),
      },
      createdUser.id!,
    );

    return {
      id: createdUser.id!,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      role: createdUser.role,
    };
  }
}

const createUserHandler = new CreateUserHandler();

export { createUserHandler };
