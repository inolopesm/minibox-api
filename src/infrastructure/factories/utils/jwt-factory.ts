import { Jwt } from "../../../application/utils";
import { SECRET } from "../../configs";

export function makeJwt(): Jwt {
  return new Jwt(SECRET);
}
