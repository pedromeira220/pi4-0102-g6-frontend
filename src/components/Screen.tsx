import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ready" | "closed";

const BACKGROUND: Record<Tone, string> = {
  neutral: "bg-muted/40",
  ready: "bg-emerald-50 dark:bg-emerald-950/30",
  closed: "bg-muted",
};

// On mobile the whole page is the card (no border, full height). On larger screens it becomes a centered card.
export const CARD_CLASS =
  "flex-1 gap-6 rounded-none bg-transparent py-6 ring-0 [--card-spacing:--spacing(5)] sm:flex-none sm:rounded-xl sm:bg-card sm:py-4 sm:ring-1 sm:[--card-spacing:--spacing(4)]";

export default function Screen({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <main className={cn("flex min-h-dvh flex-col transition-colors sm:items-center sm:justify-center sm:p-4", BACKGROUND[tone])}>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-1 pb-[env(safe-area-inset-bottom)] sm:flex-none sm:px-0">
        {children}
      </div>
    </main>
  );
}
