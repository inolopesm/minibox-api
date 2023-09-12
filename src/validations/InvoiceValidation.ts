export const InvoiceValidation = {
  store: {
    type: "object",
    required: ["personId", "products"],
    properties: {
      personId: { type: "integer", minimum: 1 },
      products: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["name", "value"],
          properties: {
            name: { type: "string" },
            value: { type: "integer", minimum: 0 },
          },
        },
      },
    },
  },
};
