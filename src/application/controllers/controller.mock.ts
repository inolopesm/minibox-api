import { Controller, Request, Response } from "../protocols";

export class ControllerSpy implements Controller {
  request?: Request;
  response: Response = { statusCode: 200, body: { number: Math.random() } };

  async handle(request: Request): Promise<Response> {
    this.request = request;
    return this.response;
  }
}
