export const TeamValidation = {
  index: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  },
  show: {
    type: "object",
    required: ["teamId"],
    properties: {
      teamId: { type: "integer", minimum: 1 },
    },
  },
  store: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
    },
  },
};
