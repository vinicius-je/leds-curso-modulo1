# LEDS — Curso Módulo 1

Repositório com os códigos e exercícios desenvolvidos durante o curso do LEDS.

A organização é **um projeto npm por módulo** do curso. Cada módulo tem seu próprio `package.json` e `tsconfig.json`, e dentro de `src/` fica uma pasta por aula — cada aula com seu código e sua própria documentação.

---

## Estrutura do repositório

```
curso/
├── .gitignore
├── README.md                     # este arquivo
└── modulo01/
    ├── README.md                 # pré-requisitos e como executar as aulas
    ├── package.json              # scripts npm e dependências do módulo
    ├── tsconfig.json             # configuração do compilador TypeScript
    └── src/
        ├── aula01/
        │   ├── README.md         # conteúdo didático da aula 1
        │   └── index.ts
        ├── aula02/
        │   ├── README.md         # conteúdo didático da aula 2
        │   ├── index.ts          # orquestra o fluxo
        │   ├── services/         # uma responsabilidade por arquivo
        │   └── utils/            # apoio reutilizável (erro customizado)
        └── aula03/
            ├── README.md         # conteúdo didático da aula 3
            └── poo/              # contas, meios de pagamento e index.ts
```

---

## Como executar

Todas as instruções — pré-requisitos, instalação e os comandos de cada aula — estão em **[modulo01/README.md](modulo01/README.md)**.

Resumo rápido:

```bash
cd modulo01
npm install
npm run aula01     # roda a aula 1
npm run aula02     # roda a aula 2
npm run aula03     # roda a aula 3
```

---

## Aulas do módulo 1

| Aula | Tema | Conceitos | Documentação |
|---|---|---|---|
| 01 | Cálculo de média de alunos | Variáveis, alocação de memória, sequência/seleção/repetição, condicionais, funções | [src/aula01/README.md](modulo01/src/aula01/README.md) |
| 02 | Mesmo sistema, refatorado | Modularização, tratamento de erros, introdução a POO | [src/aula02/README.md](modulo01/src/aula02/README.md) |
| 03 | Contas bancárias e meios de pagamento | Abstração, encapsulamento, herança, polimorfismo, interface, injeção de dependência | [src/aula03/README.md](modulo01/src/aula03/README.md) |

> 📚 A aula 02 continua de onde a aula 01 parou: o mesmo programa de média, agora quebrado em vários arquivos, com validação de entrada via `try`/`catch` e uma classe de erro própria.
>
> 🏦 A aula 03 troca de problema para levar a POO ao centro: um sistema bancário pequeno em que cada arquivo demonstra um pilar — classe abstrata, `private`, `extends`, `override`, `interface` e injeção de dependência pelo construtor.

---

## Autor

[vinicius-je](https://github.com/vinicius-je)
