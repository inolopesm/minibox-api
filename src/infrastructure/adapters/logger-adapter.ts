import { Logger } from "../../application/protocols";

export class LoggerAdapter implements Logger {
  log(message: string): void {
    console.log(message);
  }
}
