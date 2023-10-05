import { Validation } from "../protocols";

export class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}
