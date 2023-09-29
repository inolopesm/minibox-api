import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type { FindOneByIdPersonRepository } from "../../repositories";

export interface FindOnePersonRequest {
  params: { personId: string };
}

export class FindOnePersonController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdPersonRepository: FindOneByIdPersonRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { personId } = request.params as FindOnePersonRequest["params"];
    const id = Number(personId);

    const person = await this.findOneByIdPersonRepository.findOneById(id);

    if (person === null) {
      return { statusCode: 400, body: { message: "Pessoa não encontrada" } };
    }

    return { statusCode: 200, body: person };
  }
}
