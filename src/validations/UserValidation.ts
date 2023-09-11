export const UserValidation = {
  store: {
    type: "object",
    required: ["username", "password", "admin"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
      admin: { type: "boolean" },
    },
  },
};
