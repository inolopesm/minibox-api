import type { JWT } from "../utils/JWT";
import type { FastifyReply, FastifyRequest } from "fastify";

export class AccessTokenMiddleware {
  constructor(private readonly jwt: JWT) {}

  async use(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const accessToken = request.headers["x-access-token"] as string;
    const payloadOrError = this.jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      await reply.status(400).send({ message: "Não autorizado" });
    }
  }
}
