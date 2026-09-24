import { Conta } from "./Conta";
import { MeioPagamento } from "./MeioPagamento";

// INJEÇÃO DE DEPENDÊNCIA
// Repare no que este arquivo NÃO tem: nenhum `new PagamentoPix()`, nenhum
// `new PagamentoBoleto()`, nenhum `import` dessas classes. O service não sabe nem que elas
// existem — ele só conhece o contrato MeioPagamento.
//
// A dependência chega pronta, de fora, pelo construtor. Isso é a injeção.
//
// O ganho: para trocar PIX por boleto ninguém mexe aqui dentro. Para testar, dá pra injetar
// um MeioPagamento falso que só registra a chamada. Se o service desse `new` na dependência,
// ela ficaria soldada e nada disso seria possível.
export class PagamentoService {

    constructor(
        private meioPagamento: MeioPagamento
    ) {}

    async pagar(
        contaOrigem: Conta,
        contaDestino: Conta,
        valor: number
    ): Promise<void> {
        await this.meioPagamento.processar(
            contaOrigem,
            contaDestino,
            valor
        );
    }
}