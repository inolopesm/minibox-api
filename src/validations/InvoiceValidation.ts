export const InvoiceValidation = {
  index: {
    type: "object",
    properties: {
      teamId: { type: "integer", minimum: 1 },
      personId: { type: "integer", minimum: 1 },
      paid: { type: "boolean" },
    },
  },
  show: {
    type: "object",
    required: ["invoiceId"],
    properties: {
      invoiceId: { type: "integer", minimum: 1 },
    },
  },
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
