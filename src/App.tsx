import { Routes, Route } from "react-router-dom";
import TicketLookup from "./pages/TicketLookup";
import OrderTracking from "./pages/OrderTracking";
import Demo from "./pages/Demo";
import Preview from "./pages/Preview";

// UI only: the routes render fixed data. The Backend 1 and Backend 2 connections come later.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketLookup />} />
      <Route
        path="/order"
        element={<OrderTracking ticket={42} stage="preparing" estimatedMinutes={8} queuePosition={3} updatedAt="2026-10-21T19:20:00" />}
      />
      <Route path="/demo" element={<Demo />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}
