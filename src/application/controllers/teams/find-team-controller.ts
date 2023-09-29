import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type {
  FindLikeNameTeamRepository,
  FindTeamRepository,
} from "../../repositories/team-repository";

export interface FindTeamRequest {
  query: { name?: string };
}

export class FindTeamController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findTeamRepository: FindTeamRepository,
    private readonly findLikeNameTeamRepository: FindLikeNameTeamRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name } = request.query as FindTeamRequest["query"];

    const teams =
      name !== undefined
        ? await this.findLikeNameTeamRepository.findLikeName(name)
        : await this.findTeamRepository.find();

    return { statusCode: 200, body: teams };
  }
}
