import type { FastifyReply, FastifyRequest } from "fastify";
import type { PersonService } from "../services/PersonService";

export class PersonController {
  constructor(private readonly personService: PersonService) {}

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name, teamId } = request.query as {
      name?: string;
      teamId?: number;
    };

    const people = await this.personService.find(name, teamId);
    await reply.status(200).send(people);
  }

  async show(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { personId } = request.params as { personId: number };
    const personOrError = await this.personService.findOne(personId);

    if (personOrError instanceof Error) {
      const error = personOrError;
      await reply.status(400).send({ message: error.message });
      return;
    }

    const person = personOrError;

    await reply.status(200).send(person);
  }

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name, teamId } = request.body as { name: string; teamId: number };
    const error = await this.personService.create(name, teamId);

    if (error instanceof Error) {
      await reply.status(400).send({ message: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { personId } = request.params as { personId: number };
    const { name, teamId } = request.body as { name: string; teamId: number };

    const error = await this.personService.update({
      id: personId,
      name,
      teamId,
    });

    if (error instanceof Error) {
      await reply.status(400).send({ message: error.message });
    }
  }
}
