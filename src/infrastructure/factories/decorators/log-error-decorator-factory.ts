import { LogErrorDecorator } from "../../../application/decorators";
import { Controller } from "../../../application/protocols";
import { LoggerAdapter } from "../../adapters";

export function makeLogErrorDecorator(
  controller: Controller,
): LogErrorDecorator {
  return new LogErrorDecorator(controller, new LoggerAdapter());
}
