import { JWT } from "../utils/jwt";
import { AccessTokenDecorator } from "./access-token-decorator";
import type { Controller, Request, Response } from "../protocols/http";
import type { Validation } from "../protocols/validation";

const SECRET = Math.random().toString(36).substring(2);

class ControllerSpy implements Controller {
  request?: Request;
  response: Response = { statusCode: 200, body: { number: Math.random() } };

  async handle(request: Request): Promise<Response> {
    this.request = request;
    return this.response;
  }
}

class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}

describe("AccessTokenDecorator", () => {
  let accessToken: string;
  let request: Request;
  let controllerSpy: ControllerSpy;
  let validationSpy: ValidationSpy;
  let accessTokenDecorator: AccessTokenDecorator;
  const jwt = new JWT(SECRET);

  beforeEach(() => {
    accessToken = jwt.sign({ sub: 123 });

    request = {
      headers: { "x-access-token": accessToken },
      path: {},
      query: {},
      body: {},
    };

    controllerSpy = new ControllerSpy();
    validationSpy = new ValidationSpy();

    accessTokenDecorator = new AccessTokenDecorator(
      controllerSpy,
      validationSpy,
      jwt,
    );
  });

  it("should return what the controller returns", async () => {
    const response = await accessTokenDecorator.handle(request);
    const expectedResponse = controllerSpy.response;
    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await accessTokenDecorator.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when verification fails", async () => {
    request.headers["x-access-token"] = "invalid-token";

    const response = await accessTokenDecorator.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Não autorizado" },
    };

    expect(response).toEqual(expectedResponse);
  });
});
