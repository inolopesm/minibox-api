export const ApiKeyValidation = {
  use: {
    type: "object",
    required: ["x-api-key"],
    properties: {
      "x-api-key": { type: "string" },
    },
  },
};
