import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type {
  UpdateNameAndTeamIdByIdPersonRepository,
  FindOneByIdTeamRepository,
} from "../../repositories";

export interface UpdatePersonRequest {
  params: { personId: string };
  body: { name: string; teamId: number };
}

export class UpdatePersonController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdTeamRepository: FindOneByIdTeamRepository,
    private readonly updateNameAndTeamIdByIdPersonRepository: UpdateNameAndTeamIdByIdPersonRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { personId } = request.params as UpdatePersonRequest["params"];
    const { name, teamId } = request.body as UpdatePersonRequest["body"];
    const id = Number(personId);

    const team = await this.findOneByIdTeamRepository.findOneById(teamId);

    if (team === null) {
      return { statusCode: 400, body: { message: "Equipe não encontrada" } };
    }

    await this.updateNameAndTeamIdByIdPersonRepository.updateNameAndTeamIdById({
      name,
      teamId,
      id,
    });

    return { statusCode: 200 };
  }
}
