export const PersonValidation = {
  index: {
    type: "object",
    properties: {
      name: { type: "string" },
      teamId: { type: "integer", minimum: 1 },
    },
  },
  show: {
    type: "object",
    required: ["personId"],
    properties: {
      personId: { type: "integer", minimum: 1 },
    },
  },
  store: {
    type: "object",
    required: ["name", "teamId"],
    properties: {
      name: { type: "string" },
      teamId: { type: "integer", minimum: 0 },
    },
  },
};
