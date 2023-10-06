import { Controller, Logger, Request, Response } from "../protocols";

export class LogErrorDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logger: Logger,
  ) {}

  async handle(request: Request): Promise<Response> {
    try {
      return await this.controller.handle(request);
    } catch (error) {
      const { name, message, stack } = error;
      this.logger.log(JSON.stringify({ name, message, stack }));

      return {
        statusCode: 500,
        body: { message: "Ocorreu um erro inesperado" },
      };
    }
  }
}
