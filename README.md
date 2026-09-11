# LEDS — Curso Módulo 1

Repositório com os códigos e exercícios desenvolvidos durante o Módulo 1 do curso do LEDS. Cada aula fica em sua própria pasta, autocontida e executável de forma independente.

---

## Estrutura do repositório

```
leds-curso-modulo1/
├── .gitignore
├── README.md
└── aula01/
    ├── package.json        # scripts npm e dependências
    ├── tsconfig.json       # configuração do compilador TypeScript
    └── src/
        └── index.ts        # código-fonte da aula 1
```

---

## Pré-requisitos

| Ferramenta | Versão mínima | Versão testada |
|---|---|---|
| [Node.js](https://nodejs.org) | 20.x | v20.20.1 |
| npm | 10.x | 10.3.0 |

Confira o que você tem instalado:

```bash
node --version
npm --version
```

---

## Como executar a aula 1

### 1. Instalar as dependências

```bash
cd aula01
npm install
```

### 2. Rodar o programa

**Opção 1 — rodar direto do TypeScript (recomendado)**

```bash
npm run start:dev
```

**Opção 2 — modo watch (reinicia sozinho a cada `Ctrl+S`)**

```bash
npm run dev
```

**Opção 3 — compilar e rodar o JavaScript gerado**

```bash
npm run build
npm start
```

> ⚠️ **Atenção:** `npm start` executa o arquivo já compilado em `dist/index.js`. Sempre rode `npm run build` antes, senão você acaba executando um build antigo.

**Limpar a pasta de build**

```bash
npm run clean
```

### Scripts npm disponíveis

| Script | Comando executado | Para que serve |
|---|---|---|
| `npm run start:dev` | `tsx src/index.ts` | Roda o TypeScript direto, sem gerar arquivos |
| `npm run dev` | `tsx watch src/index.ts` | Igual ao anterior, mas reinicia a cada alteração |
| `npm run build` | `tsc` | Compila `src/` → `dist/` |
| `npm start` | `node dist/index.js` | Executa o JavaScript compilado |
| `npm run clean` | `rimraf dist` | Apaga a pasta `dist/` |

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

## O problema resolvido

> Te pagaram um pacote de bolacha para fazer um sistema que ajude seu professor a calcular a média de cada aluno para preenchimento no sistema de notas da faculdade. Além disso, valendo uma paçoca, o professor pediu que o sistema indicasse se o aluno foi aprovado ou não — duas notas, e `média >= 7` significa aprovado.

A solução foi decomposta em quatro passos, que é exatamente a ordem executada dentro de `main()`:

1. Pegar os dados do aluno
2. Calcular a média
3. Exibir o resultado
4. Verificar se o processo deve se repetir para outro aluno

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
  | `ExibirGuiaPreenchimentoNota` | [aula01/src/index.ts:11](aula01/src/index.ts#L11) | Instrui o uso do ponto decimal |
  | `CalcularMedia` | [aula01/src/index.ts:15](aula01/src/index.ts#L15) | Média aritmética das duas notas |
  | `ExibirResultadoFinalAluno` | [aula01/src/index.ts:19](aula01/src/index.ts#L19) | Compara com `NOTA_CORTE` e exibe aprovado/reprovado |
  | `LoopDeveContinuar` | [aula01/src/index.ts:30](aula01/src/index.ts#L30) | Pergunta `[S/N]` e devolve se o loop segue |
  | `ColetaDadosDoAluno` | [aula01/src/index.ts:45](aula01/src/index.ts#L45) | Lê nome, nota1 e nota2 do terminal |
  | `main` | [aula01/src/index.ts:58](aula01/src/index.ts#L58) | Orquestra o loop e fecha o `readline` |

- **Separação por camada:** entrada (`ColetaDadosDoAluno`), processamento (`CalcularMedia`), saída (`ExibirResultadoFinalAluno`), controle de fluxo (`LoopDeveContinuar`) e orquestração (`main`).
- **Reúso na prática:** `ExibirGuiaPreenchimentoNota()` é chamada em dois pontos diferentes. Se o texto da instrução mudar, muda em um lugar só.
- **Módulos externos** trazidos com `import` — aqui, dois módulos nativos do Node:
  ```ts
  import * as readline from 'node:readline/promises';
  import { stdin as input, stdout as output } from 'node:process';
  ```
- **Próximo passo natural:** quebrar o arquivo único em vários (`calculos.ts`, `entrada.ts`, `saida.ts`) e conectá-los com `export` / `import`.

---

## Autor

[vinicius-je](https://github.com/vinicius-je)
