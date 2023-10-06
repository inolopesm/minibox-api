import { Logger } from "../protocols";

export class LoggerSpy implements Logger {
  message?: string;

  log(message: string): void {
    this.message = message;
  }
}
