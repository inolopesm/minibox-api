import { Knex } from "knex";
import { User } from "../../application/entities";
import { makeUser } from "../../application/entities/user.mock";
import { makeJwt } from "../factories";
import { KnexHelper } from "../helpers";
import { removeId } from "../utils";

describe("Session Routes", () => {
  let knex: Knex;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
  });

  beforeEach(async () => {
    await knex<User>("User").truncate();
  });

  describe("POST /sessions", () => {
    it("should create session when success", async () => {
      const user = makeUser();
      await knex<User>("User").insert(removeId(user));
      const { username, password } = user;

      const response = await fetch(`${process.env.TEST_BASE_URL}/sessions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const accessToken = makeJwt().sign({ sub: 1, username });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ accessToken });
    });
  });
});
