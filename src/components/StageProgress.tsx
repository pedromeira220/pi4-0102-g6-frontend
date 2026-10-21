import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stage } from "@/types";

const STAGES: { key: Stage; label: string }[] = [
  { key: "received", label: "Recebido" },
  { key: "preparing", label: "Em preparo" },
  { key: "ready", label: "Pronto" },
];

export default function StageProgress({ stage }: { stage: Stage }) {
  const current = STAGES.findIndex((s) => s.key === stage);
  const currentIndex = stage === "closed" ? STAGES.length : current;

  return (
    <ol className="flex items-start" aria-label="Etapas do pedido">
      {STAGES.map((s, i) => {
        const done = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={s.key} className="relative flex flex-1 flex-col items-center gap-2" aria-current={isCurrent ? "step" : undefined}>
            {i > 0 && (
              <span className={cn("absolute top-[18px] right-1/2 h-0.5 w-full -translate-y-1/2", i <= currentIndex ? "bg-primary" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 flex size-9 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary text-primary",
                !done && !isCurrent && "border-border text-muted-foreground"
              )}
            >
              {done ? <Check className="size-5" /> : i + 1}
            </span>
            <span className={cn("text-sm", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
