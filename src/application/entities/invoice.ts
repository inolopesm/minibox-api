export interface Invoice {
  id: number;
  personId: number;
  createdAt: number;
  paidAt: number | null;
}

export interface InvoiceProduct {
  id: number;
  invoiceId: number;
  name: string;
  value: number;
}
