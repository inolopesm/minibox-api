import { SafeJSON } from "./safe-json";

describe("SafeJSON", () => {
  describe("parse", () => {
    it("should parse valid JSON", () => {
      const json = '{"foo": "bar"}';
      const parsed = SafeJSON.parse<{ foo: string }>(json);
      expect(parsed).toEqual({ foo: "bar" });
    });

    it("should return undefined for invalid JSON", () => {
      const invalidJson = '{foo: "bar"}';
      const parsed = SafeJSON.parse<{ foo: string }>(invalidJson);
      expect(parsed).toBeUndefined();
    });
  });
});
