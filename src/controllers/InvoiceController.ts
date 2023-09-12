import type { FastifyReply, FastifyRequest } from "fastify";
import type { InvoiceService } from "../services/InvoiceService";

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  async index(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    const invoices = await this.invoiceService.find();
    await reply.status(200).send(invoices);
  }

  async store(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { personId, products } = request.body as {
      personId: number;
      products: Array<{ name: string; value: number }>;
    };

    const error = await this.invoiceService.create({ personId, products });

    if (error instanceof Error) {
      await reply.status(400).send({ message: error.message });
    }
  }
}