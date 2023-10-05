import { Knex } from "knex";
import { User } from "../../application/entities";
import { makeUser } from "../../application/entities/user.mock";
import { API_KEY } from "../configs";
import { KnexHelper } from "../helpers";

describe("User Routes", () => {
  let knex: Knex;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
  });

  beforeEach(async () => {
    await knex<User>("User").truncate();
  });

  describe("POST /users", () => {
    it("should create user when success", async () => {
      const user = makeUser();
      const { username, password } = user;

      const response = await fetch(`${process.env.TEST_BASE_URL}/users`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ username, password }),
      });

      const rows = await knex<User>("User");
      const expectedRows: User[] = [{ ...user, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });
});
