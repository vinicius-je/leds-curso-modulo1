# Aula 01 — Cálculo de média de alunos

Aplicação de console em TypeScript que lê duas notas por aluno, calcula a média e informa se ele foi aprovado ou reprovado, repetindo o processo enquanto o usuário quiser.

> **Como rodar:** pré-requisitos e instruções completas estão no [README do módulo](../../README.md#como-executar).
> Resumo rápido: `npm install` e depois `npm run aula01`.

---

## O problema resolvido

> Te pagaram um pacote de bolacha para fazer um sistema que ajude seu professor a calcular a média de cada aluno para preenchimento no sistema de notas da faculdade. Além disso, valendo uma paçoca, o professor pediu que o sistema indicasse se o aluno foi aprovado ou não — duas notas, e `média >= 7` significa aprovado.

A solução foi decomposta em quatro passos, que é exatamente a ordem executada dentro de `main()`:

1. Pegar os dados do aluno
2. Calcular a média
3. Exibir o resultado
4. Verificar se o processo deve se repetir para outro aluno

---

## Exemplo de uso

```
seu nome: Maria
Nota deve ser preenchida com (.), exemplo: 8.5
nota1: 8.5
Nota deve ser preenchida com (.), exemplo: 8.5
nota2: 6.0
O aluno Maria foi aprovado com média 7.25
Deseja continuar para o próximo aluno? [S: sim, N: não, mas com respeito!]: S
seu nome: João
Nota deve ser preenchida com (.), exemplo: 8.5
nota1: 5.0
Nota deve ser preenchida com (.), exemplo: 8.5
nota2: 6.5
O aluno João foi reprovado com média 5.75
Deseja continuar para o próximo aluno? [S: sim, N: não, mas com respeito!]: N
```

Dois detalhes importantes na hora de usar:

- As notas usam **ponto** como separador decimal (`8.5`), não vírgula.
- Na pergunta final, apenas `S` (ou `s`) continua o programa. Qualquer outra resposta encerra a execução.

---

## Conteúdo abordado na aula 1

### Variáveis

- **Mutável vs. imutável:** `let` para valores que mudam, `const` para valores fixos.
  ```ts
  let nome: string = await rl.question("seu nome: ");
  const NOTA_CORTE: number = 7.0;
  ```
- **Tipagem explícita** do TypeScript: `string`, `number`, `boolean`.
- **Constante nomeada** no lugar de número mágico — `NOTA_CORTE` em vez de espalhar `7.0` pelo código.
- **Conversão de tipo:** tudo que vem do terminal chega como texto e precisa virar número.
  ```ts
  let nota1: number = Number(await rl.question("nota1: "));
  ```
- **Template literals** para montar mensagens com valores dentro:
  ```ts
  console.log(`O aluno ${nome} foi aprovado com média ${media}`);
  ```
- **Convenção de nomes:** `camelCase` para variáveis, `UPPER_SNAKE_CASE` para constantes.

### Alocação de memória

- **Declaração vs. atribuição:** declarar reserva o espaço; atribuir coloca o valor lá dentro.
- **Primitivos vs. objetos:** `number`, `string` e `boolean` guardam o valor diretamente; já `ColetaDadosDoAluno` devolve um **objeto** — uma estrutura composta que agrupa três valores:
  ```ts
  return { nota1, nota2, nome };
  ```
- **Escopo e tempo de vida:** cada variável só existe dentro do bloco onde foi declarada e é liberada quando aquele bloco termina.
  - `NOTA_CORTE` só existe dentro de `ExibirResultadoFinalAluno`
  - `condicionalLoop` só existe dentro de `main`
  - `nota1`, `nota2` e `nome` são recriados a cada volta do `while`
- **Passagem por valor:** `LoopDeveContinuar(condicionalLoop)` recebe uma **cópia** do booleano. Alterar essa cópia dentro da função não muda a variável original — por isso o valor precisa ser **retornado** e reatribuído:
  ```ts
  condicionalLoop = await LoopDeveContinuar(condicionalLoop);
  ```
- **Desestruturação:** extrair os campos de um objeto para variáveis separadas, de uma vez só.
  ```ts
  let { nota1, nota2, nome } = await ColetaDadosDoAluno();
  ```

### Estruturas básicas (a tríade)

Toda lógica de programação se constrói com apenas três estruturas.

#### 1. Sequência

Comandos executados um após o outro, de cima para baixo, na ordem escrita:

```ts
let { nota1, nota2, nome } = await ColetaDadosDoAluno();   // 1. coletar
let media: number = CalcularMedia(nota1, nota2);           // 2. calcular
ExibirResultadoFinalAluno(media, nome);                    // 3. exibir
condicionalLoop = await LoopDeveContinuar(condicionalLoop); // 4. continuar?
```

#### 2. Seleção

O programa escolhe **um entre dois ou mais caminhos** com base em uma condição:

```ts
if (media < NOTA_CORTE) {
    console.log(`O aluno ${nome} foi reprovado com média ${media}`);
    return;
}
console.log(`O aluno ${nome} foi aprovado com média ${media}`);
```

#### 3. Repetição

Um bloco é executado várias vezes enquanto a condição continuar verdadeira:

```ts
let condicionalLoop: boolean = true;
while (condicionalLoop) {
    // ... processa um aluno ...
    condicionalLoop = await LoopDeveContinuar(condicionalLoop);
}
```

A **flag booleana** é o que controla a parada: se ela nunca virasse `false`, teríamos um loop infinito.

### Condicionais

- **Operadores relacionais:** `<`, `>`, `<=`, `>=` — como em `media < NOTA_CORTE`.
- **Igualdade estrita:** `===` e `!==` comparam valor **e** tipo. Prefira sempre a `==` / `!=`.
  ```ts
  if (loopContinua === 'N') { condicionalLoop = false; }
  ```
- **Operadores lógicos:** `&&` (e), `||` (ou), `!` (não). Combinam várias condições em uma só:
  ```ts
  if (loopContinua !== 'N' && loopContinua !== 'S') {
      condicionalLoop = false;
  }
  ```
- **Guard clause (retorno antecipado):** tratar o caso especial primeiro e sair da função, em vez de aninhar `else`. Deixa o código mais plano e legível.
- **Normalizar antes de comparar:** `.toUpperCase()` faz `s` e `S` caírem no mesmo caso, evitando duplicar condições.

### Funções

- **Duas sintaxes**, usadas lado a lado no mesmo arquivo:
  ```ts
  // declaração de função
  function ExibirGuiaPreenchimentoNota() {
      console.log("Nota deve ser preenchida com (.), exemplo: 8.5");
  }

  // arrow function
  const CalcularMedia = (nota1: number, nota2: number): number => {
      return (nota1 + nota2) / 2;
  };
  ```
- **Parâmetros e retorno tipados:** a assinatura `(nota1: number, nota2: number): number` é um contrato — o compilador garante que ninguém passe um texto onde se espera um número.
- **Função com retorno vs. função de efeito colateral:** `CalcularMedia` devolve um valor; `ExibirGuiaPreenchimentoNota` não devolve nada, apenas imprime na tela.
- **Funções assíncronas:** tudo que espera o usuário digitar é assíncrono. `async` marca a função e `await` pausa até a resposta chegar.
  ```ts
  async function LoopDeveContinuar(condicionalLoop: boolean): Promise<boolean> { ... }
  ```
- **Por que criar funções:** dar nome ao trecho (o nome vira documentação), evitar repetição e permitir testar cada parte isoladamente.

### Modularização

- **Uma responsabilidade por função** — cada uma faz uma coisa só e faz bem:

  | Função | Local | Responsabilidade |
  |---|---|---|
  | `ExibirGuiaPreenchimentoNota` | [index.ts:11](index.ts#L11) | Instrui o uso do ponto decimal |
  | `CalcularMedia` | [index.ts:15](index.ts#L15) | Média aritmética das duas notas |
  | `ExibirResultadoFinalAluno` | [index.ts:19](index.ts#L19) | Compara com `NOTA_CORTE` e exibe aprovado/reprovado |
  | `LoopDeveContinuar` | [index.ts:30](index.ts#L30) | Pergunta `[S/N]` e devolve se o loop segue |
  | `ColetaDadosDoAluno` | [index.ts:45](index.ts#L45) | Lê nome, nota1 e nota2 do terminal |
  | `main` | [index.ts:58](index.ts#L58) | Orquestra o loop e fecha o `readline` |

- **Separação por camada:** entrada (`ColetaDadosDoAluno`), processamento (`CalcularMedia`), saída (`ExibirResultadoFinalAluno`), controle de fluxo (`LoopDeveContinuar`) e orquestração (`main`).
- **Reúso na prática:** `ExibirGuiaPreenchimentoNota()` é chamada em dois pontos diferentes. Se o texto da instrução mudar, muda em um lugar só.
- **Módulos externos** trazidos com `import` — aqui, dois módulos nativos do Node:
  ```ts
  import * as readline from 'node:readline/promises';
  import { stdin as input, stdout as output } from 'node:process';
  ```
- **Próximo passo natural:** quebrar o arquivo único em vários e conectá-los com `export` / `import`. É exatamente o que a [aula 02](../aula02/README.md) faz com este mesmo programa.
