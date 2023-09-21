import { type InvoiceRepository } from "../repositories/InvoiceRepository";
import { type PersonRepository } from "../repositories/PersonRepository";
import { InvoiceService } from "./InvoiceService";

const randomInt = (): number =>
  Number.parseInt(Math.random().toString().substring(2), 10);

const randomString = (): string => Math.random().toString(36).substring(2);

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

const mapInvoiceTeamId = (
  array: Awaited<ReturnType<InvoiceRepository["find"]>>,
  teamId: number,
): Awaited<ReturnType<InvoiceRepository["find"]>> =>
  array.map((i) => ({
    ...i,
    person: { ...i.person, teamId, team: { ...i.person.team, id: teamId } },
  }));

const mapInvoicePersonId = (
  array: Awaited<ReturnType<InvoiceRepository["find"]>>,
  personId: number,
): Awaited<ReturnType<InvoiceRepository["find"]>> =>
  array.map((i) => ({
    ...i,
    personId,
    person: { ...i.person, id: personId },
  }));

const filterInvoicePaid = (
  array: Awaited<ReturnType<InvoiceRepository["find"]>>,
  paid: boolean,
): Awaited<ReturnType<InvoiceRepository["find"]>> =>
  array.filter((i) => (paid ? i.paidAt !== null : i.paidAt === null));

const filterInvoicePaidAt = (
  array: Awaited<ReturnType<InvoiceRepository["find"]>>,
  paidAt: number | null,
): Awaited<ReturnType<InvoiceRepository["find"]>> =>
  array.filter((i) => i.paidAt === paidAt);

describe("InvoiceService", () => {
  let invoices: Awaited<ReturnType<InvoiceRepository["find"]>>;

  let invoice: NonNullable<
    Awaited<ReturnType<InvoiceRepository["findOneById"]>>
  >;

  let invoiceRepository: jest.Mocked<
    Pick<
      InvoiceRepository,
      | "find"
      | "findByTeamId"
      | "findByTeamIdAndPersonId"
      | "findByTeamIdAndPaidAt"
      | "findByTeamIdAndPersonIdAndPaidAt"
      | "findByPersonId"
      | "findByPersonIdAndPaidAt"
      | "findByPaidAt"
      | "findOneById"
      | "create"
      | "updatePaidAtById"
    >
  >;

  let personRepository: jest.Mocked<Pick<PersonRepository, "countById">>;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoices = [
      {
        id: randomInt(),
        personId: randomInt(),
        createdAt: randomInt(),
        paidAt: randomInt(),
        person: {
          id: randomInt(),
          name: randomString(),
          teamId: randomInt(),
          team: {
            id: randomInt(),
            name: randomString(),
          },
        },
        products: [
          {
            id: randomInt(),
            name: randomString(),
            value: randomInt(),
            invoiceId: randomInt(),
          },
          {
            id: randomInt(),
            name: randomString(),
            value: randomInt(),
            invoiceId: randomInt(),
          },
        ],
      },
      {
        id: randomInt(),
        personId: randomInt(),
        createdAt: randomInt(),
        paidAt: null,
        person: {
          id: randomInt(),
          name: randomString(),
          teamId: randomInt(),
          team: {
            id: randomInt(),
            name: randomString(),
          },
        },
        products: [
          {
            id: randomInt(),
            name: randomString(),
            value: randomInt(),
            invoiceId: randomInt(),
          },
          {
            id: randomInt(),
            name: randomString(),
            value: randomInt(),
            invoiceId: randomInt(),
          },
        ],
      },
    ];

    invoice = {
      id: randomInt(),
      personId: randomInt(),
      createdAt: randomInt(),
      paidAt: null,
      person: {
        id: randomInt(),
        name: randomString(),
        teamId: randomInt(),
        team: {
          id: randomInt(),
          name: randomString(),
        },
      },
      products: [
        {
          id: randomInt(),
          name: randomString(),
          value: randomInt(),
          invoiceId: randomInt(),
        },
        {
          id: randomInt(),
          name: randomString(),
          value: randomInt(),
          invoiceId: randomInt(),
        },
      ],
    };

    invoiceRepository = {
      find: jestFn<InvoiceRepository["find"]>(async () => invoices),

      findByTeamId: jestFn<InvoiceRepository["findByTeamId"]>(async (teamId) =>
        mapInvoiceTeamId(invoices, teamId),
      ),

      findByTeamIdAndPersonId: jestFn<
        InvoiceRepository["findByTeamIdAndPersonId"]
      >(async (teamId, personId) =>
        mapInvoicePersonId(mapInvoiceTeamId(invoices, teamId), personId),
      ),

      findByTeamIdAndPaidAt: jestFn<InvoiceRepository["findByTeamIdAndPaidAt"]>(
        async (teamId, paidAt) =>
          typeof paidAt === "boolean"
            ? filterInvoicePaid(mapInvoiceTeamId(invoices, teamId), paidAt)
            : filterInvoicePaidAt(mapInvoiceTeamId(invoices, teamId), paidAt),
      ),

      findByTeamIdAndPersonIdAndPaidAt: jestFn<
        InvoiceRepository["findByTeamIdAndPersonIdAndPaidAt"]
      >(async ({ teamId, personId, paidAt }) =>
        mapInvoicePersonId(
          mapInvoiceTeamId(
            typeof paidAt === "boolean"
              ? filterInvoicePaid(invoices, paidAt)
              : filterInvoicePaidAt(invoices, paidAt),
            teamId,
          ),
          personId,
        ),
      ),

      findByPersonId: jestFn<InvoiceRepository["findByPersonId"]>(
        async (personId) => mapInvoicePersonId(invoices, personId),
      ),

      findByPersonIdAndPaidAt: jestFn<
        InvoiceRepository["findByPersonIdAndPaidAt"]
      >(async (personId, paidAt) =>
        typeof paidAt === "boolean"
          ? filterInvoicePaid(mapInvoicePersonId(invoices, personId), paidAt)
          : filterInvoicePaidAt(mapInvoicePersonId(invoices, personId), paidAt),
      ),

      findByPaidAt: jestFn<InvoiceRepository["findByPaidAt"]>(async (paidAt) =>
        typeof paidAt === "boolean"
          ? filterInvoicePaid(invoices, paidAt)
          : filterInvoicePaidAt(invoices, paidAt),
      ),

      findOneById: jestFn<InvoiceRepository["findOneById"]>(async (id) => ({
        ...invoice,
        id,
      })),

      create: jestFn<InvoiceRepository["create"]>(async () => {}),

      updatePaidAtById: jestFn<InvoiceRepository["updatePaidAtById"]>(
        async () => {},
      ),
    };

    personRepository = {
      countById: jestFn<PersonRepository["countById"]>(async () => 1),
    };

    invoiceService = new InvoiceService(
      invoiceRepository as unknown as InvoiceRepository,
      personRepository as unknown as PersonRepository,
    );
  });

  describe("find", () => {
    it("should return all invoices if teamId, personId and paid are not provided", async () => {
      const result = await invoiceService.find({
        teamId: undefined,
        personId: undefined,
        paid: undefined,
      });

      expect(invoiceRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(invoices);
    });

    it("should return invoices by teamId if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: undefined,
        paid: undefined,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByTeamId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mapInvoiceTeamId(invoices, params.teamId));
    });

    it("should return invoices by teamId and personId if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: randomInt(),
        paid: undefined,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByTeamIdAndPersonId).toHaveBeenCalledTimes(
        1,
      );

      expect(result).toEqual(
        mapInvoicePersonId(
          mapInvoiceTeamId(invoices, params.teamId),
          params.personId,
        ),
      );
    });

    it("should return invoices by teamId and paid if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: undefined,
        paid: true,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByTeamIdAndPaidAt).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoiceTeamId(invoices, params.teamId),
          params.paid,
        ),
      );
    });

    it("should return invoices by teamId and not paid if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: undefined,
        paid: false,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByTeamIdAndPaidAt).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoiceTeamId(invoices, params.teamId),
          params.paid,
        ),
      );
    });

    it("should return invoices by teamId, personId and paid if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: randomInt(),
        paid: true,
      };

      const result = await invoiceService.find(params);

      expect(
        invoiceRepository.findByTeamIdAndPersonIdAndPaidAt,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoicePersonId(
            mapInvoiceTeamId(invoices, params.teamId),
            params.personId,
          ),
          params.paid,
        ),
      );
    });

    it("should return invoices by teamId, personId and not paid if provided", async () => {
      const params = {
        teamId: randomInt(),
        personId: randomInt(),
        paid: false,
      };

      const result = await invoiceService.find(params);

      expect(
        invoiceRepository.findByTeamIdAndPersonIdAndPaidAt,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoicePersonId(
            mapInvoiceTeamId(invoices, params.teamId),
            params.personId,
          ),
          params.paid,
        ),
      );
    });

    it("should return invoices by personId if provided", async () => {
      const params = {
        teamId: undefined,
        personId: randomInt(),
        paid: undefined,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByPersonId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mapInvoicePersonId(invoices, params.personId));
    });

    it("should return invoices by personId and paid if provided", async () => {
      const params = {
        teamId: undefined,
        personId: randomInt(),
        paid: true,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByPersonIdAndPaidAt).toHaveBeenCalledTimes(
        1,
      );

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoicePersonId(invoices, params.personId),
          params.paid,
        ),
      );
    });

    it("should return invoices by personId and not paid if provided", async () => {
      const params = {
        teamId: undefined,
        personId: randomInt(),
        paid: false,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByPersonIdAndPaidAt).toHaveBeenCalledTimes(
        1,
      );

      expect(result).toEqual(
        filterInvoicePaid(
          mapInvoicePersonId(invoices, params.personId),
          params.paid,
        ),
      );
    });

    it("should return invoices by paid if provided", async () => {
      const params = {
        teamId: undefined,
        personId: undefined,
        paid: true,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByPaidAt).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filterInvoicePaid(invoices, params.paid));
    });

    it("should return invoices by not paid if provided", async () => {
      const params = {
        teamId: undefined,
        personId: undefined,
        paid: false,
      };

      const result = await invoiceService.find(params);

      expect(invoiceRepository.findByPaidAt).toHaveBeenCalledTimes(1);
      expect(result).toEqual(filterInvoicePaid(invoices, params.paid));
    });
  });

  describe("findOne", () => {
    it("should return a person when a valid id is provided", async () => {
      const result = await invoiceService.findOne(invoice.id);
      expect(result).toEqual(invoice);
    });

    it("should return an error when an invalid id is provided", async () => {
      invoiceRepository.findOneById.mockResolvedValueOnce(null);
      const id = randomInt();
      const result = await invoiceService.findOne(id);
      expect(result).toEqual(new Error("Fatura não encontrada"));
    });
  });

  describe("create", () => {
    it("should return an error when an invalid personId is provided", async () => {
      personRepository.countById.mockResolvedValueOnce(0);

      const params = {
        personId: randomInt(),
        products: invoice.products.map((p) => ({
          name: p.name,
          value: p.value,
        })),
      };

      const result = await invoiceService.create(params);
      expect(personRepository.countById).toHaveBeenCalledTimes(1);
      expect(personRepository.countById).toHaveBeenCalledWith(params.personId);
      expect(result).toEqual(new Error("Pessoa não encontrada"));
    });

    it("should create person with the provided personId and products", async () => {
      const params = {
        personId: invoice.personId,
        products: invoice.products.map((p) => ({
          name: p.name,
          value: p.value,
        })),
      };

      jest.useFakeTimers();

      const result = await invoiceService.create(params);

      expect(invoiceRepository.create).toHaveBeenCalledTimes(1);

      expect(invoiceRepository.create).toHaveBeenCalledWith({
        personId: params.personId,
        createdAt: Date.now(),
        products: params.products,
      });

      expect(result).toBeNull();

      jest.useRealTimers();
    });
  });

  describe("pay", () => {
    it("should return an error when an id is provided", async () => {
      invoiceRepository.findOneById.mockResolvedValueOnce(null);
      const id = randomInt();
      const result = await invoiceService.pay(id);
      expect(invoiceRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(invoiceRepository.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(new Error("Fatura não encontrada"));
    });

    it("should return an error when an invoice is already paid", async () => {
      invoice.paidAt = randomInt();
      const result = await invoiceService.pay(invoice.id);
      expect(result).toEqual(new Error("Fatura já marcada como paga"));
    });

    it("should mark invoice paid with current timestamp", async () => {
      jest.useFakeTimers();
      const result = await invoiceService.pay(invoice.id);
      expect(invoiceRepository.updatePaidAtById).toHaveBeenCalledTimes(1);

      expect(invoiceRepository.updatePaidAtById).toHaveBeenCalledWith(
        Date.now(),
        invoice.id,
      );

      expect(result).toBeNull();
      jest.useRealTimers();
    });
  });
});
