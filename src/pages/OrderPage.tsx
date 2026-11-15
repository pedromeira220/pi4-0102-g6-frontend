import { useParams } from "react-router-dom";
import Screen, { CARD_CLASS } from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrder } from "@/hooks/useOrder";
import OrderTracking from "./OrderTracking";
import TicketLookup from "./TicketLookup";

// Route /order/:ticket. Keeps the ticket in the URL so reloading the page brings the same order back.
export default function OrderPage() {
  const ticket = Number(useParams().ticket);
  const state = useOrder(ticket);

  if (!Number.isInteger(ticket) || state.status === "not-found") return <TicketLookup error />;
  if (state.status === "found") return <OrderTracking {...state.order} />;

  return (
    <Screen>
      <Card className={`${CARD_CLASS} justify-center`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold sm:text-xl">
            {state.status === "loading" ? "Buscando seu pedido…" : "Não foi possível consultar agora"}
          </CardTitle>
          {state.status === "unavailable" && (
            <CardDescription className="text-base sm:text-sm">O sistema está fora do ar. Tente de novo em instantes.</CardDescription>
          )}
        </CardHeader>
        {state.status === "unavailable" && (
          <CardContent>
            <Button className="h-12 w-full text-base sm:h-9 sm:text-sm" onClick={() => window.location.reload()}>
              Tentar de novo
            </Button>
          </CardContent>
        )}
      </Card>
    </Screen>
  );
}
