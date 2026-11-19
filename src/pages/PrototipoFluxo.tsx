// PROTÓTIPO — painel da cozinha para mostrar a donos de restaurante.
// Lê a fila do Backend 1 (GET /painel); quem cria e avança os pedidos é o SimuladorDaFila de lá.
// Pergunta que responde: ver a fila e os cozinheiros (a restrição) ajuda o restaurante a enxergar o gargalo?
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { resetDemo } from "@/api/orders";

type PedidoNoPainel = {
  senha: number;
  etapa: "recebido" | "em_preparo" | "pronto" | "encerrado";
  segundosDePreparo: number;
  criadoEm: string;
  inicioPreparo?: string | null;
  prontoEm?: string | null;
};

type Painel = {
  agora: string;
  cozinheiros: number;
  ritmo: "normal" | "pico";
  chegadaMinSeg: number;
  chegadaMaxSeg: number;
  segundosPorMinuto: number;
  toleranciaProntoSeg: number;
  pedidos: PedidoNoPainel[];
};

const RITMOS = { normal: "Movimento normal", pico: "Horário de pico" } as const;
const PREPARO_MEDIO_MIN = 7.1; // média do cardápio: 4,6 min de principal + 1,5 × 1,67 min de acompanhamentos

// O backend manda LocalDateTime sem fuso; navegador e servidor estão no mesmo fuso, então lemos como hora local.
const seg = (iso: string) => new Date(iso).getTime() / 1000;

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const fmt = (s: number) => {
  const r = Math.max(0, Math.round(s));
  return r >= 60 ? `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}` : `0:${String(r).padStart(2, "0")}`;
};

export default function PrototipoFluxo() {
  const [painel, setPainel] = useState<Painel | null>(null);
  const [erro, setErro] = useState(false);
  const cozinheiroDe = useRef(new Map<number, number>()); // senha → cozinheiro, para o cartão não pular de lugar

  async function carregar() {
    try {
      const resposta = await fetch("/api/painel");
      if (!resposta.ok) throw new Error(String(resposta.status));
      setPainel(await resposta.json());
      setErro(false);
    } catch {
      setErro(true);
    }
  }

  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 1000);
    return () => clearInterval(id);
  }, []);

  async function mudarRitmo(ritmo: keyof typeof RITMOS) {
    await fetch(`/api/demo/ritmo/${ritmo}`, { method: "POST" });
    carregar();
  }

  async function reiniciar() {
    await resetDemo();
    cozinheiroDe.current.clear();
    carregar();
  }

  if (!painel) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4 text-muted-foreground">
        {erro ? "Não foi possível falar com o Backend 1." : "Carregando o painel…"}
      </main>
    );
  }

  const t = seg(painel.agora);
  const COZINHEIROS = painel.cozinheiros;
  const pedidos = painel.pedidos.map((p) => ({
    ...p,
    chegada: seg(p.criadoEm),
    inicio: p.inicioPreparo ? seg(p.inicioPreparo) : undefined,
    fim: p.prontoEm ? seg(p.prontoEm) : undefined,
  }));
  const fila = pedidos.filter((p) => p.etapa === "recebido");
  const emPreparo = pedidos.filter((p) => p.etapa === "em_preparo");
  const feitos = pedidos.filter((p) => p.fim !== undefined);
  const prontos = pedidos.filter((p) => p.etapa === "pronto");

  // Cada pedido em preparo fica no mesmo cozinheiro até sair; quem entra pega o primeiro livre.
  const mapa = cozinheiroDe.current;
  for (const senha of [...mapa.keys()]) if (!emPreparo.some((p) => p.senha === senha)) mapa.delete(senha);
  for (const p of emPreparo) {
    if (mapa.has(p.senha)) continue;
    const ocupados = new Set(mapa.values());
    let c = 0;
    while (ocupados.has(c)) c++;
    mapa.set(p.senha, c);
  }

  const inicioDemo = Math.min(t, ...pedidos.map((p) => p.chegada));
  const duracao = t - inicioDemo;
  const ocupado = pedidos.reduce((s, p) => (p.inicio === undefined ? s : s + Math.max(0, (p.fim ?? t) - p.inicio)), 0);
  const demandaPorMin = 60 / ((painel.chegadaMinSeg + painel.chegadaMaxSeg) / 2);
  const capacidadePorMin = (COZINHEIROS * 60) / (PREPARO_MEDIO_MIN * painel.segundosPorMinuto);
  const carga = demandaPorMin / capacidadePorMin;
  const estoura = carga > 1;

  return (
    <main className="flex min-h-dvh flex-col gap-4 bg-muted/40 p-4 text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Painel da cozinha</h1>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">PROTÓTIPO</span>
          {erro && <span className="text-xs font-semibold text-red-700">sem conexão com o Backend 1</span>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex overflow-hidden rounded-md border bg-background">
            {(Object.keys(RITMOS) as (keyof typeof RITMOS)[]).map((k) => (
              <button key={k} onClick={() => mudarRitmo(k)} className={`px-3 py-1.5 ${painel.ritmo === k ? "bg-foreground text-background" : ""}`}>
                {RITMOS[k]}
              </button>
            ))}
          </div>
          <button onClick={reiniciar} className="rounded-md border bg-background p-2" aria-label="Reiniciar">
            <RotateCcw className="size-4" />
          </button>
        </div>
      </header>

      <section className="grid flex-1 gap-4 md:grid-cols-[1fr_1.4fr_1fr]">
        <Coluna titulo="Na fila" n={fila.length} alerta={fila.length >= COZINHEIROS}>
          {fila.map((p) => (
            <Ticket key={p.senha} senha={p.senha} tempo={`esperando ${fmt(t - p.chegada)}`} cor={t - p.chegada > 60 ? "red" : "zinc"} />
          ))}
        </Coluna>

        <Coluna titulo="Cozinheiros" n={`${emPreparo.length}/${COZINHEIROS}`}>
          {Array.from({ length: COZINHEIROS }, (_, c) => {
            const p = emPreparo.find((x) => mapa.get(x.senha) === c);
            const decorrido = p?.inicio !== undefined ? t - p.inicio : 0;
            return p ? (
              <div key={c} className="rounded-lg border border-amber-300 bg-amber-50 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-amber-800">Cozinheiro {c + 1}</span>
                  <span className="font-mono text-lg text-amber-900">{fmt(p.segundosDePreparo - decorrido)}</span>
                </div>
                <div className="font-mono text-4xl font-bold">{p.senha}</div>
                <div className="mt-2 h-1.5 rounded bg-amber-100">
                  <div className="h-full rounded bg-amber-500" style={{ width: `${Math.min(100, (decorrido / p.segundosDePreparo) * 100)}%` }} />
                </div>
              </div>
            ) : (
              <div key={c} className="flex items-center rounded-lg border border-dashed bg-background p-3 text-sm text-muted-foreground">
                Cozinheiro {c + 1} · livre
              </div>
            );
          })}
        </Coluna>

        <Coluna titulo="Pronto" n={prontos.length}>
          {prontos.map((p) => (
            <Ticket key={p.senha} senha={p.senha} tempo={`levou ${fmt(p.fim! - p.chegada)}`} cor="green" />
          ))}
        </Coluna>
      </section>

      <footer className="grid grid-cols-2 gap-3 rounded-xl border bg-background p-4 sm:grid-cols-[repeat(4,1fr)_1.6fr]">
        <Numero nome="Tempo até ficar pronto" valor={fmt(media(pedidos.map((p) => (p.fim ?? t) - p.chegada)))} />
        <Numero nome="Espera na fila" valor={fmt(media(pedidos.map((p) => (p.inicio ?? t) - p.chegada)))} />
        <Numero nome="Pedidos por minuto" valor={duracao > 0 ? ((feitos.length / duracao) * 60).toFixed(1) : "0.0"} />
        <Numero nome="Cozinheiros ocupados" valor={`${duracao > 0 ? Math.min(100, Math.round((ocupado / (COZINHEIROS * duracao)) * 100)) : 0}%`} />
        <div className={`col-span-2 flex items-center rounded-lg px-4 py-2 text-sm font-semibold sm:col-span-1 ${estoura ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
          {estoura ? `Chegam mais pedidos do que a cozinha faz (${Math.round(carga * 100)}%): a fila vai crescer` : `A cozinha dá conta (${Math.round(carga * 100)}% da capacidade)`}
        </div>
      </footer>
    </main>
  );
}

function Coluna({ titulo, n, alerta, children }: { titulo: string; n: number | string; alerta?: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl p-3 ${alerta ? "border border-red-400 bg-red-50/60" : "border bg-background"}`}>
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-semibold">{titulo}</h2>
        <span className="font-mono text-3xl font-bold">{n}</span>
      </div>
      {children}
    </div>
  );
}

const CORES = {
  zinc: "border bg-background",
  red: "border border-red-300 bg-red-50 text-red-900",
  green: "border border-emerald-300 bg-emerald-50 text-emerald-900",
};

function Ticket({ senha, tempo, cor }: { senha: number; tempo: string; cor: keyof typeof CORES }) {
  return (
    <div className={`flex items-baseline justify-between rounded-lg px-3 py-2 ${CORES[cor]}`}>
      <span className="font-mono text-2xl font-bold">{senha}</span>
      <span className="font-mono text-sm opacity-80">{tempo}</span>
    </div>
  );
}

function Numero({ nome, valor }: { nome: string; valor: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{nome}</p>
      <p className="font-mono text-2xl font-bold">{valor}</p>
    </div>
  );
}
