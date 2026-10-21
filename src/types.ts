// The backend contracts (CT1, CT4, CT6) name these stages in Portuguese
// (recebido, em_preparo, pronto, encerrado); translate at the API boundary.
export type Stage = "received" | "preparing" | "ready" | "closed";
