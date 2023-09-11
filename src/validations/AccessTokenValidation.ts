export const AccessTokenValidation = {
  use: {
    type: "object",
    required: ["x-access-token"],
    properties: {
      "x-access-token": { type: "string" },
    },
  },
};
