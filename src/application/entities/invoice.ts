export interface Invoice {
  id: number;
  personId: number;
  createdAt: number;
  paidAt: number | null;
}
