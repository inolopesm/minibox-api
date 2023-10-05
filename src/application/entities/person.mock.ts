import { faker } from "@faker-js/faker";
import { Person } from "./person";

export function makePerson(): Person {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    name: faker.person.fullName().substring(0, 24),
    teamId: faker.number.int({ min: 1, max: 2147483647 }),
  };
}
