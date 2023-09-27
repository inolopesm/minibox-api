import * as crypto from "node:crypto";
import { SafeJSON } from "./safe-json";

export class JWT {
  constructor(private readonly secret: string) {}

  sign(payload: Record<string, unknown>): string {
    const header = { alg: "HS256", typ: "JWT" };
    const stringifiedHeader = JSON.stringify(header);
    const headerBase64 = Buffer.from(stringifiedHeader).toString("base64url");

    const stringifiedPayload = JSON.stringify(payload);
    const payloadBase64 = Buffer.from(stringifiedPayload).toString("base64url");

    const data = `${headerBase64}.${payloadBase64}`;

    const signature = crypto
      .createHmac("sha256", this.secret)
      .update(data)
      .digest("base64url");

    return `${data}.${signature}`;
  }

  verify<T>(token: string): T | Error {
    const [headerBase64, payloadBase64, signature] = token.split(".", 3) as [
      string,
      string | undefined,
      string | undefined,
    ];

    const headerText = Buffer.from(headerBase64, "base64url").toString("utf-8");
    const expectedHeader = '{"alg":"HS256","typ":"JWT"}';
    if (headerText !== expectedHeader) return new Error("Token not supported");

    if (payloadBase64 === undefined) return new Error("Invalid token");
    const payloadBuffer = Buffer.from(payloadBase64, "base64url");
    const payloadText = payloadBuffer.toString("utf8");
    const payloadObject = SafeJSON.parse<T>(payloadText);
    if (payloadObject === undefined) return new Error("Invalid token");

    if (signature === undefined) return new Error("signature is required");

    const expectedSignature = crypto
      .createHmac("sha256", this.secret)
      .update(`${headerBase64}.${payloadBase64}`)
      .digest("base64url");

    if (signature !== expectedSignature) return new Error("invalid signature");

    return payloadObject as T;
  }
}
