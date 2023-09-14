import type { SessionService } from "../services/SessionService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    const result = await this.sessionService.create(username, password);

    if (result instanceof Error) {
      await reply.status(400).send({ message: result.message });
      return;
    }

    await reply.status(200).send(result);
  }
}
