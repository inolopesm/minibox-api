import { Controller, Request, Response, Validation } from "../../protocols";
import { FindLikeNameTeamRepository } from "../../repositories/team-repository";

export interface FindTeamRequest {
  query: { name?: string };
}

export class FindTeamController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findLikeNameTeamRepository: FindLikeNameTeamRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name = "" } = request.query as FindTeamRequest["query"];

    const teams = await this.findLikeNameTeamRepository.findLikeName(name);

    return { statusCode: 200, body: teams };
  }
}
