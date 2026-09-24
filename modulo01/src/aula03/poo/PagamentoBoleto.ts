import { Conta } from "./Conta";
import { MeioPagamento } from "./MeioPagamento";

// Mesmo contrato do PIX, comportamento bem diferente: boleto demora para compensar.
export class PagamentoBoleto implements MeioPagamento {
    async processar(contaOrigem: Conta, contaDestino: Conta, valor: number): Promise<void> {

        console.log("Processando boleto...");

        await new Promise(resolve =>
            setTimeout(resolve, 3000)
        );

        contaOrigem.sacar(valor);
        contaDestino.depositar(valor);

        console.log("Boleto pago com sucesso!");
    }
}
