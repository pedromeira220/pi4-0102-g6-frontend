// The backend contracts (CT1, CT4, CT6) name these stages in Portuguese
// (recebido, em_preparo, pronto, encerrado); translate at the API boundary (src/api/orders.ts).
export type Stage = "received" | "preparing" | "ready" | "closed";

export type Order = {
  ticket: number;
  stage: Stage;
  estimatedMinutes?: number;
  queuePosition?: number;
  updatedAt: string;
};
