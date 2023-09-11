import type { FastifyReply, FastifyRequest } from "fastify";

export class ApiKeyMiddleware {
  constructor(private readonly apiKey: string) {}

  async use(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (request.headers["x-api-key"] !== this.apiKey) {
      await reply.status(400).send({ message: "Não autorizado" });
    }
  }
}
