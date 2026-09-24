import { Conta } from "./Conta";

// HERANÇA + SOBRESCRITA
// Também herda tudo de Conta, mas discorda de uma coisa: aqui todo saque custa tarifa.
export class ContaCorrente extends Conta {
    private static readonly TARIFA_SAQUE: number = 0.50;

    // `override` avisa o compilador que é de propósito: este sacar substitui o da classe mãe.
    // Exemplo: saldo 1000, saque de 100, tarifa de 0.5 -> saldo final R$ 899.50.
    override sacar(valor: number): void {

        if (valor <= 0) {
            console.log("Valor inválido! O saque precisa ser maior que zero.");
            return;
        }

        const valorTotal = valor + ContaCorrente.TARIFA_SAQUE;

        if (valorTotal > this.consultarSaldo()) {
            console.log(`Saldo insuficiente na conta de ${this.titular}: R$ ${valor.toFixed(2)} + R$ ${ContaCorrente.TARIFA_SAQUE.toFixed(2)} de tarifa`);
            return;
        }

        // reaproveita a RN da classe mãe em vez de copiar. super.sacar é o sacar() de Conta
        super.sacar(valorTotal);
        console.log(`(tarifa de R$ ${ContaCorrente.TARIFA_SAQUE.toFixed(2)} cobrada de ${this.titular})`);
    }
}
