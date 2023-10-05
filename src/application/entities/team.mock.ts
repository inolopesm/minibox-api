import { faker } from "@faker-js/faker";
import { Team } from "./team";

export function makeTeam(): Team {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    name: faker.commerce.productAdjective().substring(0, 24),
  };
}
