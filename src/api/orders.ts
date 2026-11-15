import type { Order, Stage } from "@/types";

// The page reaches Backend 1 through its own origin: /api/* is proxied to Backend 1
// (nginx.conf in the container, vite.config.ts in development). That is what lets a phone
// opened from the QR code use the same address as the page.
const BACKEND_1 = "/api";

const STAGE_FROM_API: Record<string, Stage> = {
  recebido: "received",
  em_preparo: "preparing",
  pronto: "ready",
  encerrado: "closed",
};

// Fields of consultarPedido (CT1) and etapaAlterada (CT6): both carry the same five.
export type OrderMessage = {
  senha: number;
  etapa: string;
  estimativaMinutos?: number;
  posicaoNaFila?: number;
  atualizadoEm: string;
};

export function toOrder(message: OrderMessage): Order {
  return {
    ticket: message.senha,
    stage: STAGE_FROM_API[message.etapa],
    estimatedMinutes: message.estimativaMinutos,
    queuePosition: message.posicaoNaFila,
    updatedAt: message.atualizadoEm,
  };
}

export class OrderNotFound extends Error {}

// CT1 consultarPedido: GET /pedidos/{senha}
export async function fetchOrder(ticket: number): Promise<Order> {
  const response = await fetch(`${BACKEND_1}/pedidos/${ticket}`);
  if (response.status === 404) throw new OrderNotFound();
  if (!response.ok) throw new Error(`consultarPedido respondeu ${response.status}`);
  return toOrder(await response.json());
}

// CT3 reiniciarDemo: POST /demo/reiniciar, 204 with no body
export async function resetDemo(): Promise<void> {
  const response = await fetch(`${BACKEND_1}/demo/reiniciar`, { method: "POST" });
  if (!response.ok) throw new Error(`reiniciarDemo respondeu ${response.status}`);
}
