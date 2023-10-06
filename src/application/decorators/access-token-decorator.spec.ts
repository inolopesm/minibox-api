import { randomUUID } from "node:crypto";
import { ControllerSpy } from "../controllers/controller.mock";
import { Request, Response } from "../protocols";
import { Jwt } from "../utils";
import { ValidationSpy } from "../validations/validation.mock";
import { AccessTokenDecorator } from "./access-token-decorator";

const SECRET = randomUUID();

describe("AccessTokenDecorator", () => {
  let accessToken: string;
  let request: Request;
  let controllerSpy: ControllerSpy;
  let validationSpy: ValidationSpy;
  let accessTokenDecorator: AccessTokenDecorator;
  const jwt = new Jwt(SECRET);

  beforeEach(() => {
    accessToken = jwt.sign({ sub: 123 });

    request = {
      headers: { "x-access-token": accessToken },
      params: {},
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
