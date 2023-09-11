export const SafeJSON = {
  parse<T>(text: string): T | undefined {
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return undefined;
      }

      throw error;
    }
  },
};
