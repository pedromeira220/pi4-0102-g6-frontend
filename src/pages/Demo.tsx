import { useState } from "react";
import { CircleAlert, CircleCheck, RotateCcw } from "lucide-react";
import Screen, { CARD_CLASS } from "@/components/Screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetDemo } from "@/api/orders";

type Result = "idle" | "confirmed" | "failed";

export default function Demo({ confirmed = false }: { confirmed?: boolean }) {
  const [result, setResult] = useState<Result>(confirmed ? "confirmed" : "idle");
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemo();
      setResult("confirmed");
    } catch {
      setResult("failed");
    } finally {
      setResetting(false);
    }
  }

  return (
    <Screen>
      <Card className={`${CARD_CLASS} justify-center gap-8 pb-20 sm:pb-4`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold sm:text-xl">Fila de demonstração</CardTitle>
          <CardDescription className="text-base sm:text-sm">
            A cada 30 segundos entra um pedido novo e os existentes avançam de etapa. Reiniciar apaga todos os pedidos da fila.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="destructive" disabled={resetting} onClick={handleReset} className="h-14 text-base sm:h-11 sm:text-sm">
            <RotateCcw /> {resetting ? "Reiniciando…" : "Reiniciar demo"}
          </Button>
          {result === "confirmed" && (
            <Alert role="status">
              <CircleCheck />
              <AlertDescription className="text-base sm:text-sm">Fila reiniciada</AlertDescription>
            </Alert>
          )}
          {result === "failed" && (
            <Alert variant="destructive" role="alert">
              <CircleAlert />
              <AlertDescription className="text-base sm:text-sm">Não foi possível reiniciar a fila. Tente de novo.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Screen>
  );
}
