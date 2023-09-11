export const ProductValidation = {
  index: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  },
  show: {
    type: "object",
    required: ["productId"],
    properties: {
      productId: { type: "integer", minimum: 1 },
    },
  },
  store: {
    type: "object",
    required: ["name", "value"],
    properties: {
      name: { type: "string" },
      value: { type: "integer", minimum: 0 },
    },
  },
};
