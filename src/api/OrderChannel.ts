import { Client } from "@stomp/stompjs";
import type { Order } from "@/types";
import { toOrder } from "./orders";

/**
 * The page's connection with Backend 2 (CT5 acompanharPedido), shaped like the client of the
 * Fazedor de Continhas:
 *
 * - the STOMP `Client` plays the `Parceiro`: the one object the page talks to Backend 2 through;
 * - `onChange` plays the `TratadoraDeComunicado`: it waits, in parallel with the rest of the page,
 *   for a message that may never come (etapaAlterada, CT6) and reacts when it does.
 *
 * The browser cannot open a plain Java `Socket`, so this side speaks STOMP over WebSocket, which
 * is what Backend 2 exposes at /ws.
 */
export class OrderChannel {
  private readonly client: Client;

  constructor(ticket: number, onChange: (order: Order) => void, onConnected: () => void) {
    const scheme = window.location.protocol === "https:" ? "wss" : "ws";
    this.client = new Client({
      brokerURL: `${scheme}://${window.location.host}/ws`,
      // CT5: when the connection drops (phone locked, Backend 2 restarted) reconnect on its own.
      reconnectDelay: 3000,
      onConnect: () => {
        this.client.subscribe(`/topic/pedidos/${ticket}`, (frame) => onChange(toOrder(JSON.parse(frame.body))));
        // CT5: after (re)subscribing, fetch the current stage, since changes may have been missed.
        onConnected();
      },
    });
  }

  start() {
    this.client.activate();
  }

  stop() {
    void this.client.deactivate();
  }
}
