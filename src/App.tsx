import { Routes, Route } from "react-router-dom";
import TicketLookup from "./pages/TicketLookup";
import OrderPage from "./pages/OrderPage";
import Demo from "./pages/Demo";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketLookup />} />
      <Route path="/order/:ticket" element={<OrderPage />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}
