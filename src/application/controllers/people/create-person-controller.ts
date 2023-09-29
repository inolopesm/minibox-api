import { type FindOneByIdTeamRepository } from "../../repositories/team-repository";
import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { CreatePersonRepository } from "../../repositories/person-repository";

export interface CreatePersonRequest {
  body: { name: string; teamId: number };
}

export class CreatePersonController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdTeamRepository: FindOneByIdTeamRepository,
    private readonly createPersonRepository: CreatePersonRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name, teamId } = request.body as CreatePersonRequest["body"];

    const team = await this.findOneByIdTeamRepository.findOneById(teamId);

    if (team === null) {
      return { statusCode: 400, body: { message: "Equipe não encontrada" } };
    }

    await this.createPersonRepository.create(name, teamId);

    return { statusCode: 200 };
  }
}
