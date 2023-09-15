import type { InvoiceService } from "../services/InvoiceService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { teamId, personId, paid } = request.query as {
      teamId?: number;
      personId?: number;
      paid?: boolean;
    };

    const invoices = await this.invoiceService.find({ teamId, personId, paid });
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

  async pay(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { invoiceId } = request.params as { invoiceId: number };
    const error = await this.invoiceService.pay(invoiceId);

    if (error instanceof Error) {
      await reply.status(400).send({ message: error.message });
    }
  }
}
