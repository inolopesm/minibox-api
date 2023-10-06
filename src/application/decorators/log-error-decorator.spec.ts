import { ControllerSpy } from "../controllers/controller.mock";
import { Request, Response } from "../protocols";
import { LoggerSpy } from "../utils/logger.mock";
import { LogErrorDecorator } from "./log-error-decorator";

describe("LogErrorDecorator", () => {
  let logErrorDecorator: LogErrorDecorator;
  let controllerSpy: ControllerSpy;
  let loggerSpy: LoggerSpy;
  let request: Request;

  beforeEach(() => {
    controllerSpy = new ControllerSpy();
    loggerSpy = new LoggerSpy();
    logErrorDecorator = new LogErrorDecorator(controllerSpy, loggerSpy);

    request = {
      body: { number: Math.random() },
      headers: {},
      params: {},
      query: {},
    };
  });

  it("should log the error and return a 500 status code if an error occurs", async () => {
    const error = new Error("error message");

    controllerSpy.handle = async () => {
      throw error;
    };

    const response = await logErrorDecorator.handle(request);

    const expectedResponse: Response = {
      statusCode: 500,
      body: { message: "Ocorreu um erro inesperado" },
    };

    const { name, message, stack } = error;
    const expectedMessage = JSON.stringify({ name, message, stack });

    expect(response).toEqual(expectedResponse);
    expect(loggerSpy.message).toBe(expectedMessage);
  });

  it("should return the response from the controller if no error occurs", async () => {
    const response = await logErrorDecorator.handle(request);
    expect(response).toEqual(controllerSpy.response);
  });
});
