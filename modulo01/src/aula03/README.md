# Aula 03 — Os pilares da POO

Um sistema bancário pequeno: duas contas de tipos diferentes, depósitos, saques com regra de negócio e um pagamento entre elas que pode ser feito por PIX ou boleto.

O código é curto de propósito. Cada arquivo existe para mostrar **um** conceito de orientação a objetos:

1. **Abstração** — `Conta` é uma ideia genérica, não pode virar objeto.
2. **Encapsulamento** — o saldo é `private`; só muda por métodos que carregam a regra.
3. **Herança** — `ContaSalario` e `ContaCorrente` nascem prontas a partir de `Conta`.
4. **Polimorfismo** — `ContaCorrente` sobrescreve `sacar()`; PIX e boleto cumprem o mesmo contrato de jeitos diferentes.

E dois conceitos de apoio: **interface** (contrato sem implementação) e **injeção de dependência**.

> **Como rodar:** pré-requisitos e instruções completas estão no [README do módulo](../../README.md#como-executar).
> Resumo rápido: `npm install` e depois `npm run aula03`.

---

## De onde viemos

Na aula 02 a POO apareceu numa classe só, `ErrorCustomizado`, que herdava de `Error`. Era um apoio — o domínio do problema (aluno, nota, média) continuava em funções soltas.

Aqui é o contrário: **o domínio inteiro é modelado em classes**. Conta, pagamento e serviço são objetos que guardam o próprio estado e sabem o que fazer com ele. E a ideia de injeção de dependência, que na aula 02 era passar o `rl` por parâmetro, volta agora no construtor de uma classe.

---

## Exemplo de uso

O programa não pede entrada — ele roda um roteiro fixo em [poo/index.ts](poo/index.ts):

```
Ana depositou R$ 1000.00
Bruno depositou R$ 1000.00
Ana sacou R$ 100.00
Bruno sacou R$ 100.50
(tarifa de R$ 0.50 cobrada de Bruno)
Ana: R$ 900.00
Bruno: R$ 899.50
Processando boleto...
Ana sacou R$ 150.00
Bruno depositou R$ 150.00
Boleto pago com sucesso!
Ana: R$ 750.00
Bruno: R$ 1049.50
```

O que observar:

- **Ana e Bruno sacaram os mesmos R$ 100**, mas saldos diferentes: Ana tem `ContaSalario` (sem tarifa), Bruno tem `ContaCorrente` (R$ 0,50 por saque). Mesma chamada, `sacar(100)`, comportamento diferente — isso é polimorfismo.
- **Entre `Processando boleto...` e o resto há uma pausa de 3 segundos.** É o boleto simulando o tempo de compensação.
- **Ana paga R$ 150 para Bruno** e o total dos dois saldos não muda (1799,50 antes, 1799,50 depois). O pagamento é só um saque de um lado e um depósito do outro.

---

## Estrutura

```
src/aula03/
├── README.md
└── poo/
    ├── index.ts               # roteiro: cria contas, movimenta, paga
    ├── Conta.ts               # classe abstrata
    ├── ContaSalario.ts        # herda de Conta, sem mudar nada
    ├── ContaCorrente.ts       # herda de Conta, sobrescreve sacar()
    ├── MeioPagamento.ts       # interface (contrato)
    ├── PagamentoPix.ts        # implementa o contrato: instantâneo
    ├── PagamentoBoleto.ts     # implementa o contrato: demora 3s
    └── PagamentoService.ts    # recebe o meio de pagamento injetado
```

| Arquivo | Conceito principal | Responsabilidade |
|---|---|---|
| [poo/Conta.ts:16](poo/Conta.ts#L16) | Abstração + encapsulamento | Guarda saldo e titular; regras de depósito e saque |
| [poo/ContaSalario.ts:8](poo/ContaSalario.ts#L8) | Herança | Conta com comportamento padrão |
| [poo/ContaCorrente.ts:5](poo/ContaCorrente.ts#L5) | Herança + sobrescrita | Conta que cobra tarifa no saque |
| [poo/MeioPagamento.ts:9](poo/MeioPagamento.ts#L9) | Interface | Define o que todo meio de pagamento precisa ter |
| [poo/PagamentoPix.ts:6](poo/PagamentoPix.ts#L6) | Implementação de interface | Transfere na hora |
| [poo/PagamentoBoleto.ts:5](poo/PagamentoBoleto.ts#L5) | Implementação de interface | Espera 3s e transfere |
| [poo/PagamentoService.ts:14](poo/PagamentoService.ts#L14) | Injeção de dependência | Executa o pagamento sem saber qual meio é |
| [poo/index.ts:8](poo/index.ts#L8) | — | Monta os objetos e roda o roteiro |

---

## Abstração

```ts
export abstract class Conta {
    private saldo: number;
    protected titular: string
    // ...
}
```

Não existe "conta bancária" pura no mundo real: existe conta salário, conta corrente, conta poupança. `Conta` representa **o que todas elas têm em comum** — um titular, um saldo, depositar e sacar — e nada mais.

A palavra `abstract` transforma essa intenção em regra:

```ts
const c = new Conta("Ana");   // ❌ erro de compilação:
                              // Cannot create an instance of an abstract class.
```

Uma classe abstrata serve **só de molde para outros moldes**. Ela existe para ser herdada, nunca para ser instanciada.

---

## Encapsulamento

### O saldo é `private`

```ts
private saldo: number;
```

Ninguém de fora da classe `Conta` lê ou escreve `saldo` diretamente:

```ts
contaAna.saldo = 1_000_000;   // ❌ Property 'saldo' is private and only accessible within class 'Conta'.
```

O único caminho para mexer no saldo é pelos métodos da própria classe — e são eles que carregam a **regra de negócio (RN)**:

```ts
depositar(valor: number): void {
    // RN: não existe depósito de valor zero ou negativo.
    if (valor <= 0) {
        console.log("Valor inválido! O depósito precisa ser maior que zero.");
        return;
    }
    this.saldo += valor;
    // ...
}

sacar(valor: number): void {
    if (valor <= 0) { /* ... */ return; }

    // RN: não deixa a conta ficar negativa
    if (valor > this.saldo) { /* ... */ return; }

    this.saldo -= valor;
    // ...
}
```

Esse é o ganho real: **a regra mora junto do dado que ela protege**. Não importa quantos lugares do sistema façam saque — nenhum deles consegue deixar a conta negativa, porque nenhum deles toca no saldo sem passar pelo `sacar()`.

Se `saldo` fosse público, cada lugar que sacasse teria que lembrar de checar o saldo antes. Basta um esquecer.

### Ler sem poder escrever: `consultarSaldo()`

```ts
consultarSaldo(): number {
    return this.saldo;
}
```

Quem está de fora pode **ver** o saldo, mas não **alterar**. Esse método é um *getter*: expõe o valor sem expor a variável. O mesmo vale para `consultarTitular()`.

### Os três níveis de acesso

| Modificador | Quem acessa | Exemplo na aula |
|---|---|---|
| `private` | Só a própria classe | `saldo` — nem as subclasses mexem |
| `protected` | A classe e suas subclasses | `titular` — `ContaCorrente` usa na mensagem de tarifa |
| `public` (padrão) | Qualquer um | `depositar()`, `sacar()`, `consultarSaldo()` |

Repare na consequência de `saldo` ser `private` e não `protected`: nem `ContaCorrente`, que **é** uma `Conta`, consegue fazer `this.saldo`. Ela precisa usar `this.consultarSaldo()` para ler e `super.sacar()` para descontar. A regra de negócio não tem porta dos fundos, nem para a família.

---

## Herança

```ts
export class ContaSalario extends Conta {

}
```

Uma classe com corpo vazio — e mesmo assim totalmente funcional. `extends Conta` significa que `ContaSalario` já nasce com `saldo`, `titular`, `depositar()`, `sacar()`, `consultarSaldo()` e `consultarTitular()`.

Nem construtor ela precisa: quando a subclasse não declara um, herda o da superclasse. Por isso `new ContaSalario("Ana")` funciona — quem recebe o `"Ana"` é o `constructor(titular)` de `Conta`.

O corpo vazio não é preguiça. É uma afirmação: *a conta salário usa exatamente o comportamento padrão, sem tarifa nenhuma*.

```
        Conta  (abstract)
       ┌──┴──────────┐
ContaSalario    ContaCorrente
(herda tudo)    (herda tudo, troca sacar)
```

---

## Sobrescrita (polimorfismo por herança)

`ContaCorrente` também herda tudo de `Conta`, mas discorda de uma coisa: todo saque custa tarifa.

```ts
export class ContaCorrente extends Conta {
    private static readonly TARIFA_SAQUE: number = 0.50;

    override sacar(valor: number): void {
        if (valor <= 0) { /* ... */ return; }

        const valorTotal = valor + ContaCorrente.TARIFA_SAQUE;

        if (valorTotal > this.consultarSaldo()) { /* ... */ return; }

        super.sacar(valorTotal);
        console.log(`(tarifa de R$ ${ContaCorrente.TARIFA_SAQUE.toFixed(2)} cobrada de ${this.titular})`);
    }
}
```

### `override`

Avisa o compilador: *este método substitui, de propósito, um que já existe na classe mãe*. Se alguém renomear `sacar` em `Conta` para `retirar`, o `override` faz o TypeScript reclamar aqui — sem ele, `ContaCorrente.sacar` viraria silenciosamente um método novo e a tarifa sumiria.

### `super.sacar(valorTotal)`

`super` é a classe mãe. `super.sacar()` chama o `sacar()` **original** de `Conta` — com todas as regras dele (valor positivo, saldo suficiente) e com acesso ao `saldo` privado.

É reaproveitamento, não cópia: `ContaCorrente` só acrescenta a tarifa e delega o resto. Se a regra de saque em `Conta` mudar, a conta corrente herda a mudança automaticamente.

Por isso a saída mostra `Bruno sacou R$ 100.50`: quem imprime essa linha é o `sacar()` de `Conta`, e o valor que chegou nele já inclui a tarifa.

### `private static readonly`

- **`static`** — a tarifa pertence à **classe**, não a cada objeto. Todas as contas correntes compartilham o mesmo valor, e ele é acessado por `ContaCorrente.TARIFA_SAQUE`, não por `this.TARIFA_SAQUE`.
- **`readonly`** — ninguém altera depois de definida.
- **`private`** — detalhe interno; quem está de fora nem sabe que existe.

### Polimorfismo

Em `index.ts`:

```ts
contaAna.sacar(100);     // ContaSalario  -> desconta 100.00
contaBruno.sacar(100);   // ContaCorrente -> desconta 100.50
```

A mesma mensagem, `sacar(100)`, e cada objeto responde do seu jeito. Quem chama não precisa saber qual tipo de conta tem nas mãos — e esse é o ponto: qualquer função que receba uma `Conta` funciona com as duas.

---

## Interface

```ts
export interface MeioPagamento {
    processar(
        contaOrigem: Conta,
        contaDestino: Conta,
        valor: number
    ): Promise<void>;
}
```

Interface é **contrato, não implementação**. Ela diz *o que* tem que existir, nunca *como*. Não tem corpo de método, não tem atributo com valor, não pode virar objeto com `new`.

### `implements`

```ts
export class PagamentoPix implements MeioPagamento {
    async processar(contaOrigem: Conta, contaDestino: Conta, valor: number): Promise<void> {
        contaOrigem.sacar(valor);
        contaDestino.depositar(valor);
        console.log("Pagamento realizado via PIX!");
    }
}
```

```ts
export class PagamentoBoleto implements MeioPagamento {
    async processar(contaOrigem: Conta, contaDestino: Conta, valor: number): Promise<void> {
        console.log("Processando boleto...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        contaOrigem.sacar(valor);
        contaDestino.depositar(valor);
        console.log("Boleto pago com sucesso!");
    }
}
```

`implements MeioPagamento` é uma assinatura embaixo do contrato. Se a classe esquecer o `processar`, ou declarar com parâmetros diferentes, o TypeScript não compila.

Mesmo contrato, comportamentos diferentes: PIX é instantâneo, boleto espera 3 segundos. Polimorfismo de novo — agora sem herança.

### Por que o contrato devolve `Promise<void>`?

Porque **algum** meio de pagamento pode demorar (o boleto demora). O contrato é pensado para o caso mais exigente. O PIX não espera nada, mas por ser `async` também devolve uma `Promise` — e assim quem chama pode usar `await` sem se importar com qual meio recebeu.

### Interface vs classe abstrata

| | `interface MeioPagamento` | `abstract class Conta` |
|---|---|---|
| Tem código dentro? | Não, só assinaturas | Sim, `depositar` e `sacar` completos |
| Tem estado? | Não | Sim, `saldo` e `titular` |
| Como se usa | `implements` | `extends` |
| Quantas por classe | Várias | Uma só |
| Quando escolher | Tipos diferentes que só precisam **fazer** a mesma coisa | Tipos parecidos que **são** a mesma coisa e compartilham código |

PIX e boleto não compartilham nenhuma linha de código — só a promessa de ter um `processar`. Por isso interface. Conta salário e conta corrente compartilham quase tudo. Por isso classe abstrata.

---

## Injeção de dependência

```ts
export class PagamentoService {

    constructor(
        private meioPagamento: MeioPagamento
    ) {}

    async pagar(contaOrigem: Conta, contaDestino: Conta, valor: number): Promise<void> {
        await this.meioPagamento.processar(contaOrigem, contaDestino, valor);
    }
}
```

Repare no que esse arquivo **não** tem: nenhum `new PagamentoPix()`, nenhum `new PagamentoBoleto()`, nenhum `import` dessas classes. O service não sabe nem que elas existem. Ele só conhece o contrato `MeioPagamento`.

A dependência chega **pronta, de fora**, pelo construtor:

```ts
let servicoPix = new PagamentoService(meioPagamento);   // index.ts decide qual
await servicoPix.pagar(contaAna, contaBruno, 150);
```

Na aula 02 foi a mesma ideia com o `readline`: criado em `main()` e passado para quem precisava. Aqui a dependência é um objeto que implementa uma interface, e é passada no construtor.

O ganho:

- **Trocar PIX por boleto não mexe no service.** Só muda o que se passa no `new PagamentoService(...)`.
- **Criar um novo meio de pagamento não mexe no service.** Basta uma classe nova com `implements MeioPagamento`.
- **Testar fica fácil.** Dá para injetar um `MeioPagamento` falso que só registra a chamada, sem mexer em conta nenhuma.

Se o service fizesse `new PagamentoPix()` lá dentro, a dependência ficaria soldada e nada disso seria possível.

### Atalho do TypeScript: *parameter property*

```ts
constructor(private meioPagamento: MeioPagamento) {}
```

Colocar `private` direto no parâmetro do construtor é um atalho. Ele equivale a:

```ts
private meioPagamento: MeioPagamento;

constructor(meioPagamento: MeioPagamento) {
    this.meioPagamento = meioPagamento;
}
```

Declara o atributo, recebe o parâmetro e faz a atribuição — tudo numa linha.

---

## Escolhendo o meio de pagamento

```ts
let meioPagamento : MeioPagamento = new PagamentoBoleto()

let tipo: string = "boleto";

if (tipo == "pix"){
    meioPagamento = new PagamentoPix()
}

if (tipo == "boleto"){
    meioPagamento = new PagamentoBoleto()
}
```

A variável é tipada pela **interface**, `MeioPagamento`, não por uma classe concreta. É isso que permite guardar nela tanto um `PagamentoPix` quanto um `PagamentoBoleto`.

Troque `"boleto"` por `"pix"` e rode de novo: a pausa de 3 segundos some e a mensagem muda, sem tocar em mais nenhum arquivo.

---

## Pontos de atenção

Coisas que o código atual faz e valem discussão:

- **Pagamento cria dinheiro do nada se o saque falhar.** `sacar()` devolve `void`: quando o saldo é insuficiente, ele só imprime um aviso e retorna. O `processar()` não tem como saber disso e chama `depositar()` no destino mesmo assim. Teste com `pagar(contaAna, contaBruno, 5000)`. A saída de `sacar()` precisaria sinalizar falha — um `boolean` de retorno ou, melhor, um `throw` como na aula 02.
- **`new PagamentoBoleto()` aparece duas vezes.** A variável já nasce com um boleto e o `if (tipo == "boleto")` cria outro. Se `tipo` não for nem `"pix"` nem `"boleto"`, o programa segue em boleto sem avisar.
- **A variável se chama `servicoPix` mas recebe boleto.** Nome que mente é bug esperando para acontecer. `servicoPagamento` descreve melhor.
- **A mensagem `Bruno sacou R$ 100.50`** mistura saque e tarifa: Bruno pediu R$ 100 e recebeu R$ 100.

---

## Desafios

Propostos no fim de [poo/index.ts](poo/index.ts#L46):

1. **Corrigir a implementação do saque na conta corrente.** Pista: releia os pontos de atenção acima e a regra de validação duplicada entre `Conta.sacar` e `ContaCorrente.sacar`.
2. **Implementar novos meios de pagamento.** Cartão de crédito, TED, o que quiser — basta `implements MeioPagamento`. Se precisou mexer no `PagamentoService`, algo saiu do lugar.
3. **(Bônus) Escolher o meio de pagamento sem uma pilha de `if`.** Cada meio novo hoje exige mais um `if` no `index.ts`. Pista: um objeto que mapeia o nome ao meio de pagamento, como `Record<string, MeioPagamento>`, troca a pilha de `if` por uma consulta.
