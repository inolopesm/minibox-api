import { faker } from "@faker-js/faker";
import { Invoice, InvoiceProduct } from "./invoice";

export function makeInvoice(): Invoice {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    personId: faker.number.int({ min: 1, max: 2147483647 }),
    createdAt: faker.date.past().getTime(),
    paidAt: faker.datatype.boolean() ? faker.date.recent().getTime() : null,
  };
}

export function makeInvoiceProduct(): InvoiceProduct {
  return {
    id: faker.number.int({ min: 1 }),
    invoiceId: faker.number.int({ min: 1 }),
    name: faker.commerce.productName(),
    value: +faker.commerce.price({ dec: 0 }),
  };
}
