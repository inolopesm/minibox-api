import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { UpdateNameByIdTeamRepository } from "../../repositories/team-repository";

export interface UpdateTeamRequest {
  params: { teamId: string };
  body: { name: string };
}

export class UpdateTeamController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateNameByIdTeamRepository: UpdateNameByIdTeamRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { teamId } = request.params as UpdateTeamRequest["params"];
    const { name } = request.body as UpdateTeamRequest["body"];
    const id = Number(teamId);

    await this.updateNameByIdTeamRepository.updateNameById(name, id);

    return { statusCode: 200 };
  }
}
