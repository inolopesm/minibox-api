import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type { FindOneByIdTeamRepository } from "../../repositories";

export interface FindOneTeamRequest {
  params: { teamId: string };
}

export class FindOneTeamController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdTeamRepository: FindOneByIdTeamRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { teamId } = request.params as FindOneTeamRequest["params"];
    const id = Number(teamId);

    const team = await this.findOneByIdTeamRepository.findOneById(id);

    if (team === null) {
      return { statusCode: 400, body: { message: "Produto não encontrado" } };
    }

    return { statusCode: 200, body: team };
  }
}
