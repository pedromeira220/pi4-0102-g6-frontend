# Fluxo do E5: Aviso de pronto

**Feito quando (da Entrega 1):** Quando a fila leva o pedido a "Pronto", a tela aberta muda de cor e mostra "Pedido pronto, pode retirar". O aviso fica visível até o pedido ser encerrado.

## Passos

1. O cliente está com a tela da senha 42 aberta e inscrita no canal do pedido (fluxo E3).
2. O simulador do Backend 1 avança o pedido 42 de em_preparo para pronto.
3. O Backend 1 grava a etapa nova na tabela pedido (CT2).
4. O Backend 1 envia a mensagem etapaGravada (CT4) ao Backend 2 pelo Socket.
5. O Backend 2 repassa a mensagem etapaAlterada (CT6), com a etapa pronto, para as páginas inscritas no canal do pedido 42.
6. O Frontend muda a cor da tela e mostra "Pedido pronto, pode retirar".
7. O aviso continua na tela até chegar uma etapaAlterada (CT6) com a etapa encerrado.

## Diagrama

```mermaid
sequenceDiagram
    actor Cliente
    participant Frontend
    participant B2 as Backend 2
    participant B1 as Backend 1
    participant Banco
    Note over Cliente,Frontend: tela da senha 42 aberta e inscrita (E3)
    B1->>B1: o simulador leva o pedido 42 a pronto
    B1->>Banco: CT2 pedido (grava pronto)
    B1->>B2: CT4 etapaGravada
    B2->>Frontend: CT6 etapaAlterada (etapa pronto)
    Frontend-->>Cliente: muda de cor e mostra "Pedido pronto, pode retirar"
```

**Contratos usados:** CT2 pedido, CT4 etapaGravada, CT6 etapaAlterada.
