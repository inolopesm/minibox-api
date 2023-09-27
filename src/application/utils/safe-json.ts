export const SafeJSON = {
  parse<T>(text: string): T | undefined {
    try {
      return JSON.parse(text) as T;
    } catch {
      return undefined;
    }
  },
};
