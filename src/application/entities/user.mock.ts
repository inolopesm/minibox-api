import { faker } from "@faker-js/faker";
import { User } from "./user";

export function makeUser(): User {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    username: faker.internet.userName().substring(0, 24),
    password: faker.internet.password().substring(0, 24),
  };
}
