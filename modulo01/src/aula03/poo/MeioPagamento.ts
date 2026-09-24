import { Conta } from "./Conta";

// INTERFACE
// Interface é contrato, não implementação. Ela diz O QUE tem que existir, nunca COMO.
//
// Quem escrever `implements MeioPagamento` assina embaixo: "prometo ter um método processar
// que recebe duas contas e um valor, e devolve uma Promise<void>". Se faltar o método ou a
// assinatura não bater, o TypeScript reclama.
export interface MeioPagamento {
    processar(
        contaOrigem: Conta,
        contaDestino: Conta,
        valor: number
    ): Promise<void>;
}
