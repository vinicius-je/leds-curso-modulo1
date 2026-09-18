import * as readline from 'node:readline/promises';

async function LoopDeveContinuar(condicionalLoop: boolean, rl: readline.Interface): Promise<boolean> {
    let loopContinua: string = (await rl.question("Deseja continuar para o próximo aluno? [S: sim, N: não, mas com respeito!]: ")).toUpperCase();

    if (loopContinua === 'N'){
        condicionalLoop = false
    }

    if (loopContinua !== 'N' && loopContinua !== 'S') {
        condicionalLoop = false
    }

    return condicionalLoop
}

export = { LoopDeveContinuar }