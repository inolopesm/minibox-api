import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type {
  FindLikeNameAndTeamIdPersonRepository,
  FindLikeNamePersonRepository,
} from "../../repositories/person-repository";

export interface FindPersonRequest {
  query: { name?: string; teamId?: string };
}

export class FindPersonController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findLikeNamePersonRepository: FindLikeNamePersonRepository,
    private readonly findLikeNameAndTeamIdPersonRepository: FindLikeNameAndTeamIdPersonRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name = "", teamId } = request.query as FindPersonRequest["query"];

    if (teamId !== undefined) {
      const persons =
        await this.findLikeNameAndTeamIdPersonRepository.findLikeNameAndTeamId(
          name,
          Number(teamId),
        );

      return { statusCode: 200, body: persons };
    }

    const persons = await this.findLikeNamePersonRepository.findLikeName(name);

    return { statusCode: 200, body: persons };
  }
}
