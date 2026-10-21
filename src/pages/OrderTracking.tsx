import { BellRing } from "lucide-react";
import Screen, { CARD_CLASS } from "@/components/Screen";
import StageProgress from "@/components/StageProgress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Stage } from "@/types";

const STAGE_NAME: Record<Stage, string> = {
  received: "Recebido",
  preparing: "Em preparo",
  ready: "Pronto",
  closed: "Encerrado",
};

const STAGE_DESCRIPTION: Record<Stage, string> = {
  received: "A cozinha recebeu seu pedido e ele está aguardando na fila.",
  preparing: "Seu pedido está sendo preparado agora.",
  ready: "Seu pedido está pronto para ser retirado no balcão.",
  closed: "Pedido retirado e encerrado.",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-4 text-center">
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

type Props = {
  ticket: number;
  stage: Stage;
  estimatedMinutes?: number;
  queuePosition?: number;
  updatedAt: string;
};

export default function OrderTracking({ ticket, stage, estimatedMinutes, queuePosition, updatedAt }: Props) {
  const isReady = stage === "ready";
  const isClosed = stage === "closed";
  const tone = isReady ? "ready" : isClosed ? "closed" : "neutral";

  return (
    <Screen tone={tone}>
      <Card className={`${CARD_CLASS} ${isReady ? "sm:ring-emerald-600/40" : ""}`}>
        <div className="flex flex-1 flex-col justify-center gap-10 px-(--card-spacing) sm:flex-none sm:gap-6">
          <div className="grid justify-items-center gap-3 text-center">
            <span className="text-sm tracking-wide text-muted-foreground uppercase">Sua senha</span>
            <p className="text-8xl leading-none font-bold tabular-nums sm:text-6xl">{ticket}</p>
            <Badge
              variant={isClosed ? "secondary" : "default"}
              className={`h-8 px-5 text-base sm:h-5 sm:px-2 sm:text-xs ${isReady ? "bg-emerald-600 text-white" : ""}`}
            >
              {STAGE_NAME[stage]}
            </Badge>
            <p className="max-w-64 text-balance text-base text-muted-foreground sm:text-sm">{STAGE_DESCRIPTION[stage]}</p>
            <p className="text-sm text-muted-foreground/80 sm:text-xs">Atualizado às {formatTime(updatedAt)}</p>
          </div>

          {isReady && (
            <Alert className="border-emerald-600/40 bg-emerald-50 py-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" role="status">
              <BellRing />
              <AlertDescription className="text-base font-medium text-current">Pedido pronto, pode retirar</AlertDescription>
            </Alert>
          )}

          {!isClosed && <StageProgress stage={stage} />}

          {!isReady && !isClosed && (
            <div className="grid grid-cols-2 gap-3">
              <Metric value={`${estimatedMinutes} min`} label="estimativa" />
              <Metric value={`${queuePosition}º`} label="da fila" />
            </div>
          )}
          {isReady && <p className="rounded-xl bg-muted px-3 py-5 text-center text-2xl font-bold">pode retirar</p>}
          {isClosed && <p className="text-center text-base text-muted-foreground">Este pedido foi encerrado. Obrigado!</p>}
        </div>

        <div className="px-(--card-spacing)">
          <Button variant="outline" asChild className="h-12 w-full text-base sm:h-8 sm:text-sm">
            <a href="/">Consultar outra senha</a>
          </Button>
        </div>
      </Card>
    </Screen>
  );
}
