import { CircleCheck, RotateCcw } from "lucide-react";
import Screen, { CARD_CLASS } from "@/components/Screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Demo({ confirmed = false }: { confirmed?: boolean }) {
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
          <Button variant="destructive" className="h-14 text-base sm:h-11 sm:text-sm">
            <RotateCcw /> Reiniciar demo
          </Button>
          {confirmed && (
            <Alert role="status">
              <CircleCheck />
              <AlertDescription className="text-base sm:text-sm">Fila reiniciada</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Screen>
  );
}
