import TicketLookup from "./TicketLookup";
import OrderTracking from "./OrderTracking";
import Demo from "./Demo";

// Gallery to review every screen and state side by side. Not part of the product.
const STATES = [
  { title: "Ticket lookup", element: <TicketLookup /> },
  { title: "Ticket lookup: order not found", element: <TicketLookup error /> },
  { title: "Order tracking: received", element: <OrderTracking ticket={42} stage="received" estimatedMinutes={12} queuePosition={5} updatedAt="2026-10-21T19:15:00" /> },
  { title: "Order tracking: preparing", element: <OrderTracking ticket={42} stage="preparing" estimatedMinutes={8} queuePosition={3} updatedAt="2026-10-21T19:20:00" /> },
  { title: "Order tracking: ready", element: <OrderTracking ticket={42} stage="ready" updatedAt="2026-10-21T19:28:00" /> },
  { title: "Order tracking: closed", element: <OrderTracking ticket={42} stage="closed" updatedAt="2026-10-21T19:31:00" /> },
  { title: "Demo", element: <Demo /> },
  { title: "Demo: queue reset", element: <Demo confirmed /> },
];

export default function Preview() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6 p-6">
      {STATES.map((s) => (
        <figure key={s.title} className="m-0">
          <figcaption className="mb-2 font-semibold">{s.title}</figcaption>
          <div className="overflow-hidden rounded-xl border [&_main]:min-h-[520px]">{s.element}</div>
        </figure>
      ))}
    </div>
  );
}
