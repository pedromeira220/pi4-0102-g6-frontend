import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import Screen, { CARD_CLASS } from "@/components/Screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchOrder, OrderNotFound } from "@/api/orders";

const NOT_FOUND = "Pedido não encontrado, confira o número na sua senha.";
const UNAVAILABLE = "Não foi possível consultar agora. Tente de novo em instantes.";

export default function TicketLookup({ error: startWithError = false }: { error?: boolean }) {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState("");
  const [error, setError] = useState<string | null>(startWithError ? NOT_FOUND : null);
  const [searching, setSearching] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const typed = ticket.trim();
    // CT1 answers SENHA_INVALIDA for anything that is not an integer; the screen says it the same way.
    if (!/^\d{1,9}$/.test(typed)) {
      setError(NOT_FOUND);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      await fetchOrder(Number(typed));
      navigate(`/order/${Number(typed)}`);
    } catch (failure) {
      setError(failure instanceof OrderNotFound ? NOT_FOUND : UNAVAILABLE);
    } finally {
      setSearching(false);
    }
  }

  return (
    <Screen>
      <Card className={`${CARD_CLASS} justify-center gap-8 pb-20 sm:pb-4`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold sm:text-xl">Acompanhe seu pedido</CardTitle>
          <CardDescription className="text-base sm:text-sm">Digite o número da senha que está no seu comprovante.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="ticket" className="text-base sm:text-sm">Número da senha</Label>
              <Input
                id="ticket"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ex.: 42"
                value={ticket}
                onChange={(event) => setTicket(event.target.value)}
                aria-invalid={error !== null}
                className="h-16 text-center text-3xl sm:h-11 sm:text-lg"
              />
            </div>
            {error && (
              <Alert variant="destructive" role="alert">
                <CircleAlert />
                <AlertDescription className="text-base sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={searching} className="h-14 text-base sm:h-11 sm:text-sm">
              {searching ? "Buscando…" : "Acompanhar pedido"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Screen>
  );
}
