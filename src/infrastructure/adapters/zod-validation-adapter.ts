import { z } from "zod";
import { Validation } from "../../application/protocols/validation";

export class ZodValidationAdapter<T = unknown> implements Validation {
  private readonly schema: z.ZodType<T>;

  constructor(fn: (zod: typeof z) => z.ZodType<T>) {
    this.schema = fn(z);
  }

  reduce(path: Array<string | number>): string {
    return path.reduce((previous: string, current: string | number) => {
      if (typeof current === "string") return `${previous}.${current}`;
      return `${previous}[${current}]`;
    }, "");
  }

  uncapitalize(text: string): string {
    return text.substring(0, 1).toLowerCase() + text.substring(1);
  }

  validate(input: unknown): Error | null {
    const result = this.schema.safeParse(input);

    if (!result.success) {
      const messages = result.error.issues
        .map((issue) => ({ ...issue, key: this.reduce(issue.path) }))
        .map((issue) => `${issue.key} → ${this.uncapitalize(issue.message)}`);

      const message = new Intl.ListFormat("pt-BR").format(messages);
      return new Error(message);
    }

    return null;
  }
}
