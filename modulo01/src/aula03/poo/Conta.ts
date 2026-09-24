// ABSTRAÇÃO
// Classe abstrata tem como objetivo prover um template para atributos e métodos para
// as demais classes que herdam dela, além disso, uma classe abstrata não pode ser instanciada.
// "Conta" é uma ideia genérica: não existe conta bancária "pura" no mundo real, existe conta
// salário, conta corrente, conta poupança. Por isso `new Conta(...)` é erro de compilação.
//
//   Conta
//    ├── ContaSalario
//    └── ContaCorrente

// ENCAPSULAMENTO
// `private saldo` = proteção do estado. Ninguém de fora escreve nesse número direto.
// Quem quiser mexer no saldo é obrigado a passar por depositar() / sacar(), e esses métodos
// carregam a RN (regra de negócio) junto. A regra mora na classe dona do dado, não espalhada
// por quem chama.
export abstract class Conta {
    private saldo: number;
    protected titular: string

    constructor(titular: string) {
        this.saldo = 0
        this.titular = titular;
    }

    depositar(valor: number): void {

        // RN: não existe depósito de valor zero ou negativo.
        if (valor <= 0) {
            console.log("Valor inválido! O depósito precisa ser maior que zero.");
            return;
        }

        this.saldo += valor;
        console.log(`${this.titular} depositou R$ ${valor.toFixed(2)}`);
    }

    sacar(valor: number): void {

        if (valor <= 0) {
            console.log("Valor inválido! O saque precisa ser maior que zero.");
            return;
        }

        // RN: não deixa a conta ficar negativa
        if (valor > this.saldo) {
            console.log(`Saldo insuficiente na conta de ${this.titular}`);
            return;
        }

        this.saldo -= valor;
        console.log(`${this.titular} sacou R$ ${valor.toFixed(2)}`);
    }
    // getters & setters
    consultarSaldo(): number {
        return this.saldo;
    }

    consultarTitular(): string {
        return this.titular;
    }
}
