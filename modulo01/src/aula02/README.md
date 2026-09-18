# Aula 02 — Modularização, tratamento de erros e POO

O **mesmo** sistema da aula 01 — lê duas notas por aluno, calcula a média, diz se passou — reescrito de três formas:

1. **Modularização:** de um arquivo de 90 linhas para seis arquivos, um por responsabilidade.
2. **Tratamento de erros:** a entrada do usuário agora é validada com `throw` / `try` / `catch`, e nota inválida não derruba mais o programa.
3. **POO:** o erro virou uma **classe** própria, `ErrorCustomizado`, que herda de `Error`.

> **Como rodar:** pré-requisitos e instruções completas estão no [README do módulo](../../README.md#como-executar).
> Resumo rápido: `npm install` e depois `npm run aula02`.

---

## O que mudou em relação à aula 01

| | Aula 01 | Aula 02 |
|---|---|---|
| Arquivos | 1 (`index.ts`) | 6 (`index.ts` + 4 services + 1 util) |
| Nota inválida (`abc`) | vira `NaN`, média vira `NaN`, ninguém avisa | erro lançado, mensagem exibida, pergunta repetida |
| Nota fora da faixa (`50`) | aceita numa boa | rejeitada, faixa aceita é 1 a 10 |
| `readline` | variável global do módulo | criado em `main()` e passado por parâmetro |
| Erros | inexistentes | classe `ErrorCustomizado` com `statusCode` |

---

## Exemplo de uso

Repare que `abc` e `50` são recusados e a pergunta se repete até chegar uma nota válida:

```
seu nome: Maria
Nota deve ser preenchida com (.), exemplo: 8.5
nota1: abc
--- CAUSE ---
undefined
--- STACK ---
ErrorCustomizado: Valor digitado não é um número! entre com um valor válido
    at ReceberNotaValida (.../services/ColetaDadosService.ts:16:23)
    ...
--- NAME ---
ErrorCustomizado
--- MESSAGEM ---
Valor digitado não é um número! entre com um valor válido, status code: 400
undefined
Nota deve ser preenchida com (.), exemplo: 8.5
nota1: 50
--- CAUSE ---
undefined
--- STACK ---
ErrorCustomizado: Valor digitado está fora do range aceitavel, de 1 até 10
    at ReceberNotaValida (.../services/ColetaDadosService.ts:20:23)
    ...
--- NAME ---
ErrorCustomizado
--- MESSAGEM ---
Valor digitado está fora do range aceitavel, de 1 até 10, status code: 404
undefined
Nota deve ser preenchida com (.), exemplo: 8.5
nota1: 8.5
Nota deve ser preenchida com (.), exemplo: 8.5
nota2: 6.0
O aluno Maria foi aprovado com média 7.25
Deseja continuar para o próximo aluno? [S: sim, N: não, mas com respeito!]: N
```

Três detalhes dessa saída valem explicação:

- **`CAUSE` aparece como `undefined`** porque `ErrorCustomizado` nunca recebe um `cause`. O campo existe em todo `Error`, mas só é preenchido se você passar.
- **O `undefined` depois da mensagem** vem de `console.log(ex.ExibirMensagem())`: o método **já imprime** na tela e não retorna nada, então o `console.log` de fora imprime o retorno vazio. É a distinção função-com-retorno vs. função-de-efeito-colateral, da aula 01, aparecendo na prática.
- **O `STACK` completo** foi encurtado aqui; no terminal ele mostra a cadeia inteira de chamadas até o `main`.

---

## Modularização

### Um arquivo por responsabilidade

```
src/aula02/
├── index.ts                        # orquestra: só o fluxo principal
├── services/                       # regra de negócio e fluxo
│   ├── CalculoService.ts
│   ├── ColetaDadosService.ts
│   ├── ControleLoopService.ts
│   └── ExibirMensagemService.ts
└── utils/                          # apoio reutilizável, sem regra de negócio
    └── ErrorCustomizado.ts
```

| Arquivo | Exporta | Responsabilidade |
|---|---|---|
| [index.ts:9](index.ts#L9) | — | Cria o `readline`, roda o loop, fecha o `readline` |
| [services/ColetaDadosService.ts:43](services/ColetaDadosService.ts#L43) | `ColetaDadosDoAluno` | Lê nome e as duas notas, **já validadas** |
| [services/CalculoService.ts:1](services/CalculoService.ts#L1) | `CalcularMedia` | Média aritmética das duas notas |
| [services/ExibirMensagemService.ts:1](services/ExibirMensagemService.ts#L1) | `ExibirGuiaPreenchimentoNota`, `ExibirResultadoFinalAluno` | Tudo que o programa escreve na tela |
| [services/ControleLoopService.ts:3](services/ControleLoopService.ts#L3) | `LoopDeveContinuar` | Pergunta `[S/N]` e devolve se o loop segue |
| [utils/ErrorCustomizado.ts:1](utils/ErrorCustomizado.ts#L1) | `ErrorCustomizado` | Tipo de erro próprio da aplicação |

Na aula 01 essa separação já existia — mas **só em funções**, todas no mesmo arquivo. Aqui cada responsabilidade ganhou um arquivo, e o limite entre elas deixou de ser uma convenção visual para virar uma regra que o compilador cobra.

### `export` e `import`

Um arquivo só enxerga do outro aquilo que foi explicitamente exportado:

```ts
// services/CalculoService.ts — o que sai
const CalcularMedia = (nota1: number, nota2: number): number => {
    return (nota1 + nota2) / 2 ;
}

export { CalcularMedia }
```

```ts
// index.ts — o que entra
import { CalcularMedia } from './services/CalculoService';
```

Tudo que **não** é exportado fica privado do arquivo. `ReceberNotaValida`, em `ColetaDadosService.ts`, é o exemplo: ela é usada duas vezes ali dentro (nota1 e nota2) e ninguém de fora precisa saber que ela existe. Esse é o ganho real da modularização — **esconder detalhe**, não só separar texto.

### `services/` vs `utils/`

- **`services/`** — os passos do problema. Cada arquivo responde a uma pergunta do enunciado: como coletar? como calcular? o que exibir? continua?
- **`utils/`** — apoio genérico, que não fala de aluno nem de nota. `ErrorCustomizado` serviria igual em qualquer outro programa.

Pergunta que resolve a dúvida na hora de criar um arquivo novo: *se eu levar isso para outro projeto, ainda faz sentido?* Se sim, é `utils/`.

### `index.ts` virou orquestrador

O ponto de entrada não sabe **como** nada é feito — só a ordem:

```ts
let condicionalLoop: boolean = true
while(condicionalLoop){
    let { nota1, nota2, nome } = await ColetaDadosDoAluno(rl);
    let media: number = CalcularMedia(nota1, nota2)
    ExibirResultadoFinalAluno(media, nome)
    condicionalLoop = await LoopDeveContinuar(condicionalLoop, rl);
}
```

São os mesmos quatro passos do enunciado da aula 01 — coletar, calcular, exibir, repetir — agora visíveis de uma olhada só. Toda a validação de nota, que engordou bastante o código, está escondida dentro de `ColetaDadosDoAluno` e não polui a leitura do fluxo.

### O `readline` deixou de ser global

Na aula 01 o `rl` era criado no topo do arquivo e qualquer função alcançava:

```ts
const rl = readline.createInterface({ input, output });   // aula 01: global do módulo
```

Aqui ele é criado dentro de `main()` e **passado por parâmetro** para quem precisa:

```ts
async function main() {
    const rl = readline.createInterface({ input, output });
    // ...
    let { nota1, nota2, nome } = await ColetaDadosDoAluno(rl);
    condicionalLoop = await LoopDeveContinuar(condicionalLoop, rl);
    // ...
    rl.close()
}
```

Isso é **injeção de dependência**: cada módulo declara na assinatura o que precisa para funcionar, em vez de buscar um estado global. Três consequências práticas:

- Dá para ler a assinatura de `ColetaDadosDoAluno(rl)` e saber que ela conversa com o terminal — sem abrir o corpo da função.
- Dá para testar passando um `rl` falso, que devolve respostas prontas.
- Quem cria o `rl` é quem fecha (`rl.close()`), no mesmo lugar. Sem dono definido, ninguém sabe de quem é a responsabilidade de fechar.

### Dois tipos de `import`

```ts
import * as readline from 'node:readline/promises';          // módulo nativo do Node
import { stdin as input, stdout as output } from 'node:process';
import { CalcularMedia } from './services/CalculoService';   // módulo nosso
```

O prefixo `node:` marca módulo nativo. O `./` marca caminho relativo no nosso projeto — sem ele, o Node procuraria um pacote instalado com esse nome.

---

## Tratamento de erros

### O problema que ele resolve

Na aula 01, digitar `abc` como nota fazia `Number("abc")` virar `NaN`. A média virava `NaN`, a comparação `NaN < 7` era `false`, e o programa anunciava o aluno **aprovado com média NaN**. Nenhum erro, nenhum aviso — só um resultado errado.

### `throw`: sinalizar que deu errado

```ts
if (Number.isNaN(nota)){
    throw new ErrorCustomizado("Valor digitado não é um número! entre com um valor válido", "400")
}

if (nota > 10 || nota < 1){
    throw new ErrorCustomizado("Valor digitado está fora do range aceitavel, de 1 até 10", "404")
}
```

`throw` **interrompe na hora** a execução da função. Nenhuma linha depois dele roda. O erro sobe pela pilha de chamadas procurando alguém que o capture — e se ninguém capturar, o programa inteiro cai.

Repare em `Number.isNaN(nota)`: `NaN` é o único valor de JavaScript que não é igual a si mesmo, então `nota === NaN` **nunca** funciona. Testar `NaN` só com `Number.isNaN()`.

### `try` / `catch`: capturar

```ts
while(controleLoop){
    try {
        ExibirGuiaPreenchimentoNota();
        nota = Number(await rl.question(`${mensagem}: `));

        if (Number.isNaN(nota)){ throw new ErrorCustomizado(/* ... */) }
        if (nota > 10 || nota < 1){ throw new ErrorCustomizado(/* ... */) }

        controleLoop = false;     // <- só chega aqui se nada foi lançado

    } catch (ex) {
        if (ex instanceof ErrorCustomizado){
            // ... exibe o erro ...
        }
    }
}
```

- **`try`** delimita o trecho arriscado.
- **`catch (ex)`** recebe o que foi lançado e decide o que fazer.
- O que vem **depois** do `throw` dentro do `try` é pulado.

### Erro + loop = revalidação

Esse é o ponto mais importante da seção, e está numa linha só:

```ts
controleLoop = false;    // última linha do try
```

`controleLoop = false` é o que encerra o `while`. Como ela é a **última** linha do `try`, qualquer `throw` acima dela é um desvio que a pula — `controleLoop` continua `true`, o `catch` exibe o erro, e o `while` roda de novo pedindo a nota.

Ou seja: a posição da atribuição **é** a lógica de "só sai quando a entrada for válida". Se ela estivesse no início do `try`, o loop sairia na primeira tentativa, válida ou não.

### A alternativa sem `try`/`catch`

No fim de [ColetaDadosService.ts](services/ColetaDadosService.ts) há, comentada, a mesma função escrita sem exceções — vale comparar lado a lado:

```ts
if (Number.isNaN(nota)){
    console.log("Valor digitado não é um número! entre com um valor válido")
    continue          // volta para o topo do while
}
```

| | Sem `try`/`catch` | Com `try`/`catch` |
|---|---|---|
| Como avisa | `console.log` na hora | `throw` de um objeto de erro |
| Quem trata | a própria função | quem capturar — pode ser outra camada |
| Carrega informação | só o texto | mensagem + `statusCode` + `stack` + `name` |
| Atravessa funções | não, morre ali | sim, sobe até alguém capturar |

Para um `if` isolado, a versão com `continue` é mais simples e honesta. O ganho do `throw` aparece quando **quem detecta o problema não é quem sabe o que fazer com ele** — que é o caso de qualquer sistema com camadas.

### O que o objeto de erro carrega

O `catch` da aula imprime os quatro campos que todo `Error` do JavaScript tem:

| Campo | O que é |
|---|---|
| `message` | O texto passado ao construtor |
| `name` | O tipo do erro — aqui forçado para `"ErrorCustomizado"` |
| `stack` | O caminho de chamadas até o ponto do `throw`; é o que diz **onde** quebrou |
| `cause` | O erro anterior que provocou este. Fica `undefined` porque nunca passamos um |

E mais um que é nosso: `statusCode`, `"400"` para entrada malformada e `"404"` para valor fora da faixa — os mesmos códigos que uma API HTTP usaria.

### `instanceof` no `catch`

```ts
catch (ex) {
    if (ex instanceof ErrorCustomizado){
        // ...
    }
}
```

Em TypeScript, `ex` chega como `unknown` — porque em JavaScript é possível lançar **qualquer coisa**, inclusive um número ou uma string. O compilador não deixa acessar `ex.message` antes de você provar o que `ex` é, e `instanceof` é essa prova. Depois do `if`, o TypeScript sabe que `ex` é um `ErrorCustomizado` e libera o acesso a `statusCode` e `ExibirMensagem()`.

Na prática o `if` separa **erro que eu previ** de **erro que não é meu**. Vale saber que, hoje, um erro que não seja `ErrorCustomizado` cai no `catch` e é silenciosamente ignorado — o loop repete a pergunta sem explicar nada. Um `else` com um `throw ex` (relançar o que não sei tratar) resolveria.

---

## Introdução a POO

Toda a POO da aula está em um arquivo de 13 linhas:

```ts
export class ErrorCustomizado extends Error {
    statusCode: string;

    constructor(mesagem: string, statusCode: string){ super(mesagem)
        this.statusCode = statusCode;
        this.name = "ErrorCustomizado"
        Object.setPrototypeOf(this, ErrorCustomizado.prototype);
    }

    public ExibirMensagem(){
        console.log(`${this.message}, status code: ${this.statusCode}`)
    }
}
```

### Classe é o molde; objeto é o que sai dele

`class ErrorCustomizado` não é um erro — é a **descrição** de como um erro desses é. O erro de verdade nasce no `new`:

```ts
throw new ErrorCustomizado("Valor digitado não é um número! ...", "400")
```

Cada `new` produz um objeto novo e independente, com seus próprios valores. Dois erros lançados em momentos diferentes têm `statusCode` diferentes sem interferir um no outro.

Compare com a aula 01: lá, `{ nota1, nota2, nome }` também era um objeto, mas montado à mão, sem molde e sem garantia de formato. A classe dá o molde.

### Estado e comportamento no mesmo lugar

- **`statusCode: string`** é um **atributo**: o dado que cada objeto carrega.
- **`ExibirMensagem()`** é um **método**: o que o objeto sabe fazer com o próprio dado.

Essa é a ideia central da POO. Sem classe, precisaríamos de uma função solta `exibirMensagemDeErro(mensagem, statusCode)` e de alguém lembrando de chamá-la com os argumentos certos. Com classe, o erro já sabe se apresentar.

### Herança: `extends Error`

```ts
export class ErrorCustomizado extends Error {
```

`extends` diz "isto é um `Error`, **mais** o que eu acrescentar". Sem escrever uma linha, `ErrorCustomizado` já tem `message`, `name` e `stack` prontos, e já funciona em `throw` e em `catch` como qualquer erro nativo.

O vocabulário: `Error` é a **superclasse** (ou classe pai), `ErrorCustomizado` é a **subclasse**. A subclasse **especializa** — acrescenta `statusCode` e `ExibirMensagem()` sem reescrever nada do que herdou.

### `constructor` e `super()`

O `constructor` roda uma vez, no `new`, e é onde o objeto é preparado:

```ts
constructor(mesagem: string, statusCode: string){
    super(mesagem)                      // 1. deixa a superclasse montar a parte dela
    this.statusCode = statusCode;       // 2. agora a parte que é minha
    this.name = "ErrorCustomizado"
    Object.setPrototypeOf(this, ErrorCustomizado.prototype);
}
```

`super(mesagem)` chama o construtor de `Error`, que é quem preenche `message` e gera o `stack`. **Tem que vir antes** de qualquer `this` — o TypeScript recusa a compilar o contrário, porque antes do `super()` o objeto ainda não está inteiro.

`this` é o objeto que está nascendo. `this.statusCode = statusCode` guarda o parâmetro dentro do objeto, onde ele passa a existir depois que o construtor termina. A linha `this.name = "ErrorCustomizado"` sobrescreve o `name` herdado (que viria como `"Error"`) — é o que faz aparecer `ErrorCustomizado:` no começo do stack.

### `public`

```ts
public ExibirMensagem(){
```

`public` significa "qualquer um pode chamar" — e é o padrão em TypeScript, então aqui ele é documentação explícita. As alternativas são `private` (só de dentro da própria classe) e `protected` (a classe e suas subclasses). Escolher entre os três é decidir o que faz parte do **contrato** da classe e o que é detalhe interno que você quer poder mudar depois sem quebrar ninguém — a mesma ideia de esconder detalhe que já apareceu no `export`.

### `instanceof` de novo, agora do lado da classe

`ex instanceof ErrorCustomizado` pergunta: *este objeto saiu deste molde?* É a ponte entre as duas metades da aula — a classe define o molde, o `catch` usa o molde para decidir o tratamento.

### A pegadinha do `Object.setPrototypeOf`

```ts
Object.setPrototypeOf(this, ErrorCustomizado.prototype);
```

Essa linha existe por um defeito conhecido do TypeScript ao estender classes nativas como `Error`, `Array` e `Map`: quando o código é compilado para um alvo mais antigo, o construtor de `Error` devolve um objeto novo e a ligação com o molde `ErrorCustomizado` se perde. Resultado: `instanceof ErrorCustomizado` passa a devolver **`false`**, o `if` do `catch` nunca entra e o erro some sem mensagem.

`Object.setPrototypeOf` reata essa ligação à mão. É um remendo que não custa nada e evita um bug que se manifesta longe da causa — vale por reflexo em toda classe de erro própria.

---

## Para continuar

- Relançar no `catch` o que não for `ErrorCustomizado` (`else { throw ex }`), para não engolir erro desconhecido.
- Padronizar os `export` dos services: três usam `export = { ... }` (sintaxe CommonJS) e `CalculoService.ts` usa `export { ... }` (padrão ESM). Funciona, mas convém escolher um.
- Criar outras subclasses de erro (`NotaInvalidaError`, `NotaForaDoRangeError`) e tratar cada uma de um jeito — herança rendendo de verdade.
- Transformar o aluno em classe, com `nome`, `nota1`, `nota2` e um método `CalcularMedia()` dentro dele: o próximo passo natural de POO.
