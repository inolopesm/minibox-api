export interface Request {
  headers: Record<string, string>;
  path: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
}

export interface Response {
  statusCode: number;
  body?: unknown;
}

export interface Controller {
  handle: (request: Request) => Promise<Response>;
}
