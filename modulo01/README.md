# Módulo 1 — projeto TypeScript

Projeto npm que hospeda todas as aulas do módulo 1. Cada aula é uma pasta em `src/`, com seu próprio ponto de entrada (`index.ts`) e seu próprio README didático.

| Aula | Tema | Comando | Documentação |
|---|---|---|---|
| 01 | Cálculo de média de alunos | `npm run aula01` | [src/aula01/README.md](src/aula01/README.md) |
| 02 | Modularização, tratamento de erros e POO | `npm run aula02` | [src/aula02/README.md](src/aula02/README.md) |
| 03 | Pilares da POO: contas bancárias e meios de pagamento | `npm run aula03` | [src/aula03/README.md](src/aula03/README.md) |

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

## Como executar

### 1. Instalar as dependências

Uma vez só, na raiz do módulo — as dependências são compartilhadas por todas as aulas:

```bash
cd modulo01
npm install
```

### 2. Rodar a aula que você quer

**Opção 1 — rodar direto do TypeScript (recomendado)**

```bash
npm run aula01     # aula 1
npm run aula02     # aula 2
npm run aula03     # aula 3
```

**Opção 2 — modo watch (reinicia sozinho a cada `Ctrl+S`)**

```bash
npm run aula01:watch
npm run aula02:watch
npm run aula03:watch
```

**Opção 3 — compilar e rodar o JavaScript gerado**

```bash
npm run build          # compila todas as aulas de uma vez: src/ → dist/
npm run start:aula01
npm run start:aula02
npm run start:aula03
```

> ⚠️ **Atenção:** `npm run start:aula0X` executa o arquivo já compilado em `dist/`. Sempre rode `npm run build` antes, senão você acaba executando um build antigo.

**Limpar a pasta de build**

```bash
npm run clean
```

---

## Scripts npm disponíveis

| Script | Comando executado | Para que serve |
|---|---|---|
| `npm run aula01` | `tsx src/aula01/index.ts` | Roda a aula 1 direto do TypeScript, sem gerar arquivos |
| `npm run aula01:watch` | `tsx watch src/aula01/index.ts` | Igual ao anterior, mas reinicia a cada alteração |
| `npm run aula02` | `tsx src/aula02/index.ts` | Roda a aula 2 direto do TypeScript |
| `npm run aula02:watch` | `tsx watch src/aula02/index.ts` | Aula 2 em modo watch |
| `npm run aula03` | `tsx src/aula03/poo/index.ts` | Roda a aula 3 direto do TypeScript |
| `npm run aula03:watch` | `tsx watch src/aula03/poo/index.ts` | Aula 3 em modo watch |
| `npm run build` | `tsc` | Compila `src/` → `dist/`, preservando a pasta de cada aula |
| `npm run start:aula01` | `node dist/aula01/index.js` | Executa o JavaScript compilado da aula 1 |
| `npm run start:aula02` | `node dist/aula02/index.js` | Executa o JavaScript compilado da aula 2 |
| `npm run start:aula03` | `node dist/aula03/poo/index.js` | Executa o JavaScript compilado da aula 3 |
| `npm run clean` | `rimraf dist` | Apaga a pasta `dist/` |

---

## Como uma aula nova entra aqui

1. Criar `src/aulaXX/index.ts` com a função `main()`.
2. Adicionar os scripts `aulaXX` e `start:aulaXX` no `package.json`, no mesmo padrão dos existentes.
3. Escrever `src/aulaXX/README.md` com o enunciado, um exemplo de uso e os conceitos da aula.
4. Registrar a aula nas tabelas deste README e do [README da raiz](../README.md).

Nada mais precisa mudar: o `tsconfig.json` já compila tudo que estiver em `src/` (`include: ["src/**/*"]`) e espelha a estrutura de pastas dentro de `dist/`.
