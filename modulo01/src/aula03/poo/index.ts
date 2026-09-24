import { ContaSalario } from "./ContaSalario";
import { ContaCorrente } from "./ContaCorrente";
import { PagamentoPix } from "./PagamentoPix";
import { PagamentoBoleto } from "./PagamentoBoleto";
import { PagamentoService } from "./PagamentoService";
import { MeioPagamento } from "./MeioPagamento";

async function main() {

    // duas contas
    const contaAna = new ContaSalario("Ana");
    const contaBruno = new ContaCorrente("Bruno");

    // depositar
    contaAna.depositar(1000);
    contaBruno.depositar(1000);

    // sacar (conta corrente cobra R$ 0,50 de tarifa)
    contaAna.sacar(100);
    contaBruno.sacar(100);

    console.log(`Ana: R$ ${contaAna.consultarSaldo().toFixed(2)}`);
    console.log(`Bruno: R$ ${contaBruno.consultarSaldo().toFixed(2)}`);

    let meioPagamento : MeioPagamento = new PagamentoBoleto()

    let tipo: string = "boleto";

    if (tipo == "pix"){
        meioPagamento = new PagamentoPix()
    }

    if (tipo == "boleto"){
        meioPagamento = new PagamentoBoleto()
    }

    let servicoPix = new PagamentoService(meioPagamento);
    await servicoPix.pagar(contaAna, contaBruno, 150);

    console.log(`Ana: R$ ${contaAna.consultarSaldo().toFixed(2)}`);
    console.log(`Bruno: R$ ${contaBruno.consultarSaldo().toFixed(2)}`);
}

main();

// 1. Desafio corrigir a implementação do saque na conta corrente
// 2. Desafio implementar novos meios de pagamento
// 3. Desafio (bonus): resolver a definição do meio de pagamento (reduzir uso/dependencia de adição de ifs)