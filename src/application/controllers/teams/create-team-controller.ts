import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { CreateTeamRepository } from "../../repositories/team-repository";

export interface CreateTeamRequest {
  body: { name: string };
}

export class CreateTeamController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createTeamRepository: CreateTeamRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name } = request.body as CreateTeamRequest["body"];

    await this.createTeamRepository.create(name);

    return { statusCode: 200 };
  }
}
