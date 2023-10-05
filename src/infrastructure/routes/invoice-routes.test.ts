import { randomInt } from "node:crypto";
import { Knex } from "knex";

import {
  Invoice,
  InvoiceProduct,
  Person,
  Team,
} from "../../application/entities";

import {
  makeInvoice,
  makeInvoiceProduct,
} from "../../application/entities/invoice.mock";

import { makePerson } from "../../application/entities/person.mock";
import { makeTeam } from "../../application/entities/team.mock";
import { makeUser } from "../../application/entities/user.mock";
import { InvoiceDto } from "../../application/repositories";
import { makeJwt } from "../factories";
import { KnexHelper } from "../helpers";
import { removeId } from "../utils";

describe("Invoice Routes", () => {
  let knex: Knex;

  let accessToken: string;
  let query: Knex.QueryBuilder;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
    const user = makeUser();
    accessToken = makeJwt().sign({ sub: user.id, username: user.username });
  });

  beforeEach(async () => {
    await knex.raw(
      'TRUNCATE "Team", "Person", "Invoice" RESTART IDENTITY CASCADE',
    );

    // prettier-ignore
    query = knex({ i: "Invoice" })
      .select("i.*")
      .select(knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join({ p: "Person" }, "p.id", "i.personId")
      .join({ t: "Team" }, "t.id", "p.teamId")
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"])
  });

  describe("GET /invoices", () => {
    it("should find invoices when success", async () => {
      let teamNumber = 1;
      let personNumber = 1;
      let invoiceNumber = 1;
      let invoiceProductNumber = 1;

      const teams: Team[] = [
        { ...makeTeam(), id: teamNumber++ },
        { ...makeTeam(), id: teamNumber++ },
      ];

      const people = teams.flatMap<Person>((team) => [
        { ...makePerson(), id: personNumber++, teamId: team.id },
        { ...makePerson(), id: personNumber++, teamId: team.id },
      ]);

      const invoices = people.flatMap<Invoice>((person) => [
        { ...makeInvoice(), id: invoiceNumber++, personId: person.id },
        { ...makeInvoice(), id: invoiceNumber++, personId: person.id },
      ]);

      const invoiceProducts = invoices.flatMap<InvoiceProduct>((invoice) => [
        {
          ...makeInvoiceProduct(),
          id: invoiceProductNumber++,
          invoiceId: invoice.id,
        },
        {
          ...makeInvoiceProduct(),
          id: invoiceProductNumber++,
          invoiceId: invoice.id,
        },
      ]);

      await knex<Team>("Team").insert(teams.map(removeId));
      await knex<Person>("Person").insert(people.map(removeId));
      await knex<Invoice>("Invoice").insert(invoices.map(removeId));

      await knex<InvoiceProduct>("InvoiceProduct").insert(
        invoiceProducts.map(removeId),
      );

      const response = await fetch(`${process.env.TEST_BASE_URL}/invoices`, {
        headers: { "x-access-token": accessToken },
      });

      const invoiceDtos: InvoiceDto[] = invoices.map((invoice) => {
        const person = people.find((p) => p.id === invoice.personId);
        if (person === undefined)
          throw new Error("unexpected undefined person");

        const team = teams.find((t) => t.id === person.teamId);
        if (team === undefined) throw new Error("unexpected undefined team");

        const products = invoiceProducts.filter(
          (ip) => ip.invoiceId === invoice.id,
        );

        return { ...invoice, person: { ...person, team }, products };
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(invoiceDtos);
    });
  });

  describe("GET /invoices/:invoiceId", () => {
    it("should find invoice when success", async () => {
      let teamNumber = 1;
      let personNumber = 1;
      let invoiceNumber = 1;
      let invoiceProductNumber = 1;

      const teams: Team[] = [
        { ...makeTeam(), id: teamNumber++ },
        { ...makeTeam(), id: teamNumber++ },
      ];

      const people = teams.flatMap<Person>((team) => [
        { ...makePerson(), id: personNumber++, teamId: team.id },
        { ...makePerson(), id: personNumber++, teamId: team.id },
      ]);

      const invoices = people.flatMap<Invoice>((person) => [
        { ...makeInvoice(), id: invoiceNumber++, personId: person.id },
        { ...makeInvoice(), id: invoiceNumber++, personId: person.id },
      ]);

      const invoiceProducts = invoices.flatMap<InvoiceProduct>((invoice) => [
        {
          ...makeInvoiceProduct(),
          id: invoiceProductNumber++,
          invoiceId: invoice.id,
        },
        {
          ...makeInvoiceProduct(),
          id: invoiceProductNumber++,
          invoiceId: invoice.id,
        },
      ]);

      await knex<Team>("Team").insert(teams.map(removeId));
      await knex<Person>("Person").insert(people.map(removeId));
      await knex<Invoice>("Invoice").insert(invoices.map(removeId));

      await knex<InvoiceProduct>("InvoiceProduct").insert(
        invoiceProducts.map(removeId),
      );

      const index = randomInt(invoices.length);

      const response = await fetch(
        `${process.env.TEST_BASE_URL}/invoices/${index + 1}`,
        { headers: { "x-access-token": accessToken } },
      );

      const invoiceDtos: InvoiceDto[] = invoices.map((invoice) => {
        const person = people.find((p) => p.id === invoice.personId);
        if (person === undefined)
          throw new Error("unexpected undefined person");

        const team = teams.find((t) => t.id === person.teamId);
        if (team === undefined) throw new Error("unexpected undefined team");

        const products = invoiceProducts.filter(
          (ip) => ip.invoiceId === invoice.id,
        );

        return { ...invoice, person: { ...person, team }, products };
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(invoiceDtos[index]);
    });
  });

  describe("POST /invoices", () => {
    it("should create invoice when success", async () => {
      const currentTimestamp = Date.now();

      await knex<Team>("Team").insert({ name: "minibox" });
      await knex<Person>("Person").insert({ name: "matheus", teamId: 1 });

      const response = await fetch(`${process.env.TEST_BASE_URL}/invoices`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({
          personId: 1,
          products: [
            { name: "salgado", value: 500 },
            { name: "refrigerante", value: 200 },
          ],
        }),
      });

      const rows: InvoiceDto[] = await query;

      expect(response.status).toBe(200);
      expect(rows.length).toBe(1);

      for (const row of rows) {
        expect(row.id).toBe(1);
        expect(row.personId).toBe(1);

        expect(typeof row.createdAt).toBe("number");
        expect(row.createdAt).toBeGreaterThanOrEqual(currentTimestamp);
        expect(row.createdAt).toBeLessThanOrEqual(Date.now());

        expect(row.paidAt).toBeNull();
        expect(row.person.id).toBe(1);
        expect(row.person.name).toBe("matheus");
        expect(row.person.teamId).toBe(1);
        expect(row.person.team.id).toBe(1);
        expect(row.person.team.name).toBe("minibox");

        expect(row.products.length).toBe(2);

        expect(row.products).toEqual([
          { id: 1, invoiceId: 1, name: "salgado", value: 500 },
          { id: 2, invoiceId: 1, name: "refrigerante", value: 200 },
        ]);
      }
    });
  });

  describe("PUT /invoices/:invoiceId/pay", () => {
    it("should pay invoice when success", async () => {
      const currentTimestamp = Date.now();

      await knex<Team>("Team").insert({ name: "minibox" });
      await knex<Person>("Person").insert({ name: "matheus", teamId: 1 });

      await knex<Invoice>("Invoice").insert({
        personId: 1,
        createdAt: currentTimestamp,
        paidAt: null,
      });

      await knex<InvoiceProduct>("InvoiceProduct").insert([
        { invoiceId: 1, name: "salgado", value: 500 },
        { invoiceId: 1, name: "refrigerante", value: 200 },
      ]);

      const response = await fetch(
        `${process.env.TEST_BASE_URL}/invoices/1/pay`,
        { method: "PUT", headers: { "x-access-token": accessToken } },
      );

      const rows: InvoiceDto[] = await query;

      expect(response.status).toBe(200);
      expect(rows.length).toBe(1);

      for (const row of rows) {
        expect(row.id).toBe(1);
        expect(row.personId).toBe(1);
        expect(row.createdAt).toBe(currentTimestamp);

        expect(typeof row.paidAt).toBe("number");
        expect(row.paidAt).toBeGreaterThanOrEqual(currentTimestamp);
        expect(row.paidAt).toBeLessThanOrEqual(Date.now());

        expect(row.person.id).toBe(1);
        expect(row.person.name).toBe("matheus");
        expect(row.person.teamId).toBe(1);
        expect(row.person.team.id).toBe(1);
        expect(row.person.team.name).toBe("minibox");

        expect(row.products.length).toBe(2);

        expect(row.products).toEqual([
          { id: 1, invoiceId: 1, name: "salgado", value: 500 },
          { id: 2, invoiceId: 1, name: "refrigerante", value: 200 },
        ]);
      }
    });
  });
});
