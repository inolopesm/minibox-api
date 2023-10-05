/* eslint-disable @typescript-eslint/no-var-requires */
const { POSTGRES_URL } = require("./src/infrastructure/configs");
const { KnexHelper } = require("./src/infrastructure/helpers");

beforeAll(() => {
  KnexHelper.getInstance().connect(POSTGRES_URL);
})

afterAll(async () => {
  await KnexHelper.getInstance().disconnect();
});
