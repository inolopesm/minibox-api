import { UserService } from "./UserService";
import type { UserRepository } from "../repositories/UserRepository";

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

describe("UserService", () => {
  let userRepository: jest.Mocked<
    Pick<UserRepository, "countByUsername" | "create">
  >;

  let userService: UserService;

  beforeEach(() => {
    userRepository = {
      countByUsername: jestFn<UserRepository["countByUsername"]>(async () => 0),
      create: jestFn<UserRepository["create"]>(async () => {}),
    };

    userService = new UserService(userRepository as unknown as UserRepository);
  });

  describe("create", () => {
    it("should create a new user when username is not taken", async () => {
      const username = "username" + Math.random().toString(36).substring(2);
      const password = Math.random().toString(36).substring(2);
      const params = { username, password };
      const result = await userService.create(params);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(params);
      expect(result).toBeNull();
    });

    it("should return an error when username is already taken", async () => {
      userRepository.countByUsername.mockResolvedValueOnce(1);
      const username = "username" + Math.random().toString(36).substring(2);
      const password = Math.random().toString(36).substring(2);
      const result = await userService.create({ username, password });
      expect(result).toEqual(new Error("Usuário já existe"));
    });
  });
});
