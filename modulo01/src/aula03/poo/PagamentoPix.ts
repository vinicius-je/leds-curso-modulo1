import { Conta } from "./Conta";
import { MeioPagamento } from "./MeioPagamento";

// `implements MeioPagamento` = esta classe cumpre o contrato.
// PIX é instantâneo: sem tarifa e sem espera.
export class PagamentoPix implements MeioPagamento {

    async processar(contaOrigem: Conta, contaDestino: Conta, valor: number): Promise<void> {

        contaOrigem.sacar(valor);
        contaDestino.depositar(valor);

        console.log("Pagamento realizado via PIX!");
    }
}
