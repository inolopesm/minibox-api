import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "../services/UserService";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { username, password, admin } = request.body as {
      secret: string;
      username: string;
      password: string;
      admin: boolean;
    };

    const result = await this.userService.create({
      username,
      password,
      admin,
    });

    if (result instanceof Error) {
      await reply.status(400).send({ message: result.message });
      return;
    }

    await reply.status(200).send(result);
  }
}
