import { SessionService } from "./SessionService";
import type { UserRepository } from "../repositories/UserRepository";
import type { JWT } from "../utils/JWT";

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

describe("SessionService", () => {
  let userId: number;

  let userRepository: jest.Mocked<
    Pick<UserRepository, "findOneByUsernameAndPassword">
  >;

  let jwt: jest.Mocked<Pick<JWT, "sign">>;
  let sessionService: SessionService;

  beforeEach(() => {
    userId = Number.parseInt(Math.random().toString().substring(2), 10);

    userRepository = {
      findOneByUsernameAndPassword: jestFn<
        UserRepository["findOneByUsernameAndPassword"]
      >(async (username, password) => ({ id: userId, username, password })),
    };

    jwt = {
      sign: jestFn<JWT["sign"]>((payload) => JSON.stringify(payload)),
    };

    sessionService = new SessionService(
      userRepository as unknown as UserRepository,
      jwt as unknown as JWT,
    );
  });

  describe("create", () => {
    it("should return an access token when given valid credentials", async () => {
      const username = "username" + Math.random().toString(36).substring(2);
      const password = Math.random().toString(36).substring(2);
      const result = await sessionService.create(username, password);
      const accessToken = JSON.stringify({ sub: userId, username });
      expect(result).toEqual({ accessToken });
    });

    it("should return an error when given invalid credentials", async () => {
      userRepository.findOneByUsernameAndPassword.mockResolvedValueOnce(null);
      const username = "username" + Math.random().toString(36).substring(2);
      const password = Math.random().toString(36).substring(2);
      const result = await sessionService.create(username, password);
      expect(result).toEqual(new Error("Usuário e/ou senha inválido(s)"));
    });
  });
});
