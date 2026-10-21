import { CircleAlert } from "lucide-react";
import Screen, { CARD_CLASS } from "@/components/Screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TicketLookup({ error = false }: { error?: boolean }) {
  return (
    <Screen>
      <Card className={`${CARD_CLASS} justify-center gap-8 pb-20 sm:pb-4`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold sm:text-xl">Acompanhe seu pedido</CardTitle>
          <CardDescription className="text-base sm:text-sm">Digite o número da senha que está no seu comprovante.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-2">
              <Label htmlFor="ticket" className="text-base sm:text-sm">Número da senha</Label>
              <Input id="ticket" inputMode="numeric" placeholder="Ex.: 42" aria-invalid={error} className="h-16 text-center text-3xl sm:h-11 sm:text-lg" />
            </div>
            {error && (
              <Alert variant="destructive" role="alert">
                <CircleAlert />
                <AlertDescription className="text-base sm:text-sm">Pedido não encontrado, confira o número na sua senha.</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="h-14 text-base sm:h-11 sm:text-sm">Acompanhar pedido</Button>
          </form>
        </CardContent>
      </Card>
    </Screen>
  );
}
