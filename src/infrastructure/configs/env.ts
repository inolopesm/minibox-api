const variables = ["SECRET", "POSTGRES_URL", "API_KEY"];

for (const variable of variables) {
  if (process.env[variable] === undefined) {
    throw new Error(`Environment variable "${variable}" missing`);
  }
}

export const SECRET = process.env.SECRET as string;
export const POSTGRES_URL = process.env.POSTGRES_URL as string;
export const API_KEY = process.env.API_KEY as string;
