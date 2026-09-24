import { Conta } from "./Conta";

// HERANÇA
// `extends Conta` = ContaSalario já nasce com saldo, titular, depositar(), sacar() e
// consultarSaldo() sem escrever uma linha. Corpo vazio aqui não é preguiça: é a afirmação
// de que a conta salário usa o comportamento padrão de saque, sem tarifa nenhuma.
// Nem construtor precisa — herda o de Conta, que já recebe o titular.
export class ContaSalario extends Conta {
    
}