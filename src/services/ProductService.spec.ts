import { type ProductRepository } from "../repositories/ProductRepository";
import { ProductService } from "./ProductService";

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

const mapProductName = (
  array: Awaited<ReturnType<ProductRepository["findILikeName"]>>,
  name: string,
): Awaited<ReturnType<ProductRepository["findILikeName"]>> =>
  array.map((p) => ({ ...p, name: `${p.name} ${name}` }));

describe("ProductService", () => {
  let products: Awaited<ReturnType<ProductRepository["findILikeName"]>>;
  let product: NonNullable<
    Awaited<ReturnType<ProductRepository["findOneById"]>>
  >;

  let productRepository: jest.Mocked<
    Pick<
      ProductRepository,
      "findILikeName" | "findOneById" | "create" | "updateNameAndValueById"
    >
  >;

  let productService: ProductService;

  beforeEach(() => {
    products = [
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Product ${Math.random().toString(36).substring(2)}`,
        value: Number.parseInt(Math.random().toString().substring(2), 10),
      },
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Product ${Math.random().toString(36).substring(2)}`,
        value: Number.parseInt(Math.random().toString().substring(2), 10),
      },
    ];

    product = {
      id: Number.parseInt(Math.random().toString().substring(2), 10),
      name: `Product ${Math.random().toString(36).substring(2)}`,
      value: Number.parseInt(Math.random().toString().substring(2), 10),
    };

    productRepository = {
      findILikeName: jestFn<ProductRepository["findILikeName"]>(async (name) =>
        name !== "" ? mapProductName(products, name) : products,
      ),

      findOneById: jestFn<ProductRepository["findOneById"]>(async (id) => ({
        ...product,
        id,
      })),

      create: jestFn<ProductRepository["create"]>(async () => {}),

      updateNameAndValueById: jestFn<
        ProductRepository["updateNameAndValueById"]
      >(async () => {}),
    };

    productService = new ProductService(
      productRepository as unknown as ProductRepository,
    );
  });

  describe("find", () => {
    it("should return all products if name is not provided", async () => {
      const result = await productService.find();
      expect(productRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(productRepository.findILikeName).toHaveBeenCalledWith("");
      expect(result).toEqual(products);
    });

    it("should return an array of products matching the provided name", async () => {
      const name = Math.random().toString(36).substring(2);
      const result = await productService.find(name);
      expect(productRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(productRepository.findILikeName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mapProductName(products, name));
    });
  });

  describe("findOne", () => {
    it("should return a product when a valid id is provided", async () => {
      const result = await productService.findOne(product.id);
      expect(result).toEqual(product);
    });

    it("should return an error when an invalid id is provided", async () => {
      productRepository.findOneById.mockResolvedValueOnce(null);
      const id = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await productService.findOne(id);
      expect(result).toEqual(new Error("Produto não encontrado"));
    });
  });

  describe("create", () => {
    it("should create product with the provided name and value", async () => {
      const name = `Product ${Math.random().toString(36).substring(2)}`;
      const value = Number.parseInt(Math.random().toString().substring(2), 10);
      await productService.create(name, value);
      expect(productRepository.create).toHaveBeenCalledTimes(1);
      expect(productRepository.create).toHaveBeenCalledWith(name, value);
    });
  });

  describe("update", () => {
    it("should update product by id with the provided name and value", async () => {
      const params = {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Person ${Math.random().toString(36).substring(2)}`,
        value: Number.parseInt(Math.random().toString().substring(2), 10),
      };

      await productService.update(params);

      expect(productRepository.updateNameAndValueById).toHaveBeenCalledTimes(1);

      expect(productRepository.updateNameAndValueById).toHaveBeenCalledWith(
        params,
      );
    });
  });
});
