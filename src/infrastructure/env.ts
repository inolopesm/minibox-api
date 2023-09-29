import Ajv from "ajv";

const env = {
  SECRET: process.env.SECRET as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  API_KEY: process.env.API_KEY as string,
};

if (
  !new Ajv().compile<typeof env>({
    type: "object",
    required: ["SECRET", "POSTGRES_URL", "API_KEY"],
    properties: {
      SECRET: { type: "string" },
      POSTGRES_URL: { type: "string" },
      API_KEY: { type: "string" },
    },
  })(env)
)
  throw new Error("Environment variables validation failed");

export { env };
