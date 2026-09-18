import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

// TODO
// 1. apresentar variaveis
// 2. demonstrar a triade
// 3. codificar um sistema

function ExibirGuiaPreenchimentoNota (){
    console.log("Nota deve ser preenchida com (.), exemplo: 8.5")
}

const CalcularMedia = (nota1: number, nota2: number): number => {
    return (nota1 + nota2) / 2 ;
}

function ExibirResultadoFinalAluno(media: number, nome: string){
    const NOTA_CORTE: number = 7.0

    if(media < NOTA_CORTE){
        console.log(`O aluno ${nome} foi reprovado com média ${media}`)
        return
    }

    console.log(`O aluno ${nome} foi aprovado com média ${media}`)
}

async function LoopDeveContinuar(condicionalLoop: boolean): Promise<boolean> {
    let loopContinua: string = (await rl.question("Deseja continuar para o próximo aluno? [S: sim, N: não, mas com respeito!]: ")).toUpperCase();

    if (loopContinua === 'N'){
        condicionalLoop = false
    }

    if (loopContinua !== 'N' && loopContinua !== 'S') {
        condicionalLoop = false
    }

    return condicionalLoop
}


async function ColetaDadosDoAluno(): Promise<{ nota1: number; nota2: number; nome: string; }> {
    let nome: string = await rl.question("seu nome: ");
    ExibirGuiaPreenchimentoNota();
    let nota1: number = Number(await rl.question("nota1: "));
    ExibirGuiaPreenchimentoNota();
    let nota2: number = Number(await rl.question("nota2: "));
    return { nota1, nota2, nome };
}


// sequencia
// seleção
// loop
async function main() {
    // Te pagaram um pacote de bolacha para fazer um sistema que ajude seu professor a calcular a média de cada aluno para preenchimento
    // no sistema de nota da sua faculdade, além disso, valendo uma paçoca seu professor solicitou que o sistema indicasse se o aluno
    // foi aprovado ou não 
    let condicionalLoop: boolean = true
    while(condicionalLoop){
        let { nota1, nota2, nome } = await ColetaDadosDoAluno();
        let media: number = CalcularMedia(nota1, nota2)
        ExibirResultadoFinalAluno(media, nome)
        condicionalLoop = await LoopDeveContinuar(condicionalLoop);
    }
    rl.close()    
};

main();

// perguntas ? propoe solucao!
// validado e questionado
// viabilizar (PDF > GIF) -- pesquisar, entender como implementar, resultado(resposta => positiva (plano de execucao), negativa(justificativa)) --> acordo, reunião, desentendimento() - levar desaforo

// Te pagaram um pacote de bolacha para fazer um sistema que ajude seu professor a calcular a média de cada aluno para preenchimento
// no sistema de nota da sua faculdade, além disso, valendo uma paçoca seu professor solicitou que o sistema indicasse se o aluno
// foi aprovado ou não (duas notas, media >= 7 --> aprovado)

// pegar variaveis, identificar o aluno, recebe a matricula, cpf, email

// media ? eh simples ou pnderada ? tem alguma outra restricao ou meio ?

//1. pegar os dados do aluno
//2. calcular media
//3. exibir resultado
//4. verificar se deve repetir o processo para um outro aluno
