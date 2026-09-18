import { ErrorCustomizado } from "../utils/ErrorCustomizado";
import { ExibirGuiaPreenchimentoNota } from "./ExibirMensagemService";
import * as readline from 'node:readline/promises';


async function ReceberNotaValida(mensagem: string, rl: readline.Interface): Promise<number> {
    let nota: number = 0;
    let controleLoop: boolean = true;

    while(controleLoop){
        try {
            ExibirGuiaPreenchimentoNota();
            nota = Number(await rl.question(`${mensagem}: `));

            if (Number.isNaN(nota)){
                throw new ErrorCustomizado("Valor digitado não é um número! entre com um valor válido", "400")
            }

            if (nota > 10 || nota < 1){
                throw new ErrorCustomizado("Valor digitado está fora do range aceitavel, de 1 até 10", "404")
            }

            // aqui para baixo
            controleLoop = false;

        } catch (ex) {
            if (ex instanceof ErrorCustomizado){
                console.log("--- CAUSE ---")
                console.log(ex.cause)
                console.log("--- STACK ---")
                console.log(ex.stack)
                console.log("--- NAME ---")
                console.log(ex.name)
                console.log("--- MESSAGEM ---")
                console.log(ex.ExibirMensagem())
            }
        }
    }
        
    return nota
}

async function ColetaDadosDoAluno(rl: readline.Interface): Promise<{ nota1: number; nota2: number; nome: string; }> {
    let nome: string = await rl.question("seu nome: ");
    let nota1: number = await ReceberNotaValida("nota1", rl);
    let nota2: number = await ReceberNotaValida("nota2", rl);
    return { nota1, nota2, nome };
}


// async function ReceberNotaValidaSemTryCatch(mensagem: string, rl: readline.Interface): Promise<number> {
//     let nota: number = 0;
//     let controleLoop: boolean = true;

//     while(controleLoop){
//         ExibirGuiaPreenchimentoNota();
//         nota = Number(await rl.question(`${mensagem}: `));

//         if (Number.isNaN(nota)){
//             console.log("Valor digitado não é um número! entre com um valor válido")
//             continue
//         }

//         if (nota > 10 || nota < 1){
//             console.log("Valor digitado está fora do range aceitavel, de 1 até 10")
//             continue
//         }

//         controleLoop = false;
//     }
        
//     return nota
// }

export = { ColetaDadosDoAluno }