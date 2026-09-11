# LEDS — Curso Módulo 1

Repositório com os códigos e exercícios desenvolvidos durante o Módulo 1 do curso do LEDS. Cada aula fica em sua própria pasta, autocontida e executável de forma independente.

---

## Estrutura do repositório

```
leds-curso-modulo1/
├── .gitignore
├── README.md
└── aula01/
    ├── README.md           # enunciado, exemplo de uso e conceitos da aula 1
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

## Conteúdo das aulas

| Aula | Tema | Documentação |
|---|---|---|
| 01 | Cálculo de média de alunos | [aula01/README.md](aula01/README.md) |

> 📚 O enunciado do exercício, um exemplo de execução e todos os conceitos abordados — variáveis, alocação de memória, sequência/seleção/repetição, condicionais, funções e modularização — estão em **[aula01/README.md](aula01/README.md)**.

---

## Autor

[vinicius-je](https://github.com/vinicius-je)
