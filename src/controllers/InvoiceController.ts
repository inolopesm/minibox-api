import type { InvoiceService } from "../services/InvoiceService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { teamId, personId } = request.query as {
      teamId?: number;
      personId?: number;
    };

    const invoices = await this.invoiceService.find(teamId, personId);
    await reply.status(200).send(invoices);
  }

  async show(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { invoiceId } = request.params as { invoiceId: number };
    const invoiceOrError = await this.invoiceService.findOne(invoiceId);

    if (invoiceOrError instanceof Error) {
      const error = invoiceOrError;
      await reply.status(400).send({ message: error.message });
      return;
    }

    const invoice = invoiceOrError;
    await reply.status(200).send(invoice);
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
