import type { TeamService } from "../services/TeamService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name } = request.query as { name?: string };
    const teams = await this.teamService.find(name);
    await reply.status(200).send(teams);
  }

  async show(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { teamId } = request.params as { teamId: number };
    const teamOrError = await this.teamService.findOne(teamId);

    if (teamOrError instanceof Error) {
      const error = teamOrError;
      await reply.status(400).send({ message: error.message });
      return;
    }

    const team = teamOrError;

    await reply.status(200).send(team);
  }

  async store(request: FastifyRequest): Promise<void> {
    const { name } = request.body as { name: string };
    await this.teamService.create(name);
  }

  async update(request: FastifyRequest): Promise<void> {
    const { teamId } = request.params as { teamId: number };
    const { name } = request.body as { name: string };
    await this.teamService.update(name, teamId);
  }
}
