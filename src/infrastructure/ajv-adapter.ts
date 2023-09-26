import AJV, {
  type ValidateFunction,
  type JSONSchemaType,
  type DefinedError,
} from "ajv";
import type { Validation } from "../application/protocols/validation";

export class AJVAdapter<T = unknown> implements Validation {
  private readonly fn: ValidateFunction<T>;

  constructor(schema: JSONSchemaType<T>) {
    const ajv = new AJV();
    this.fn = ajv.compile(schema);
  }

  validate(input: unknown): Error | null {
    if (!this.fn(input)) {
      const messages: string[] = [];

      for (const error of this.fn.errors as DefinedError[]) {
        if (error.message !== undefined) {
          messages.push(`${error.instancePath} ${error.message}`);
        } else {
          messages.push(`${error.instancePath} is invalid`);
        }
      }

      const message = new Intl.ListFormat("pt-BR").format(messages);
      return new Error(message);
    }

    return null;
  }
}
