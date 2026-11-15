import { useEffect, useState } from "react";
import { OrderChannel } from "@/api/OrderChannel";
import { fetchOrder, OrderNotFound } from "@/api/orders";
import type { Order } from "@/types";

export type OrderState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "unavailable" }
  | { status: "found"; order: Order };

// Fetches the order once (CT1) and then keeps it current through Backend 2 (CT5, CT6).
// If Backend 2 is down the page keeps the stage CT1 returned and just stops updating on its own.
export function useOrder(ticket: number): OrderState {
  const [state, setState] = useState<OrderState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    const load = () =>
      fetchOrder(ticket)
        .then((order) => active && setState({ status: "found", order }))
        .catch((error) => {
          if (!active) return;
          if (error instanceof OrderNotFound) setState({ status: "not-found" });
          // A failed re-fetch keeps what is already on screen.
          else setState((current) => (current.status === "found" ? current : { status: "unavailable" }));
        });

    load();
    const channel = new OrderChannel(ticket, (order) => active && setState({ status: "found", order }), load);
    channel.start();

    return () => {
      active = false;
      channel.stop();
    };
  }, [ticket]);

  return state;
}
