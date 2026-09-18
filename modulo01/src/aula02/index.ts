import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { CalcularMedia } from './services/CalculoService';
import { ExibirResultadoFinalAluno } from './services/ExibirMensagemService';
import { LoopDeveContinuar } from './services/ControleLoopService';
import { ColetaDadosDoAluno } from './services/ColetaDadosService';


async function main() {
    const rl = readline.createInterface({ input, output });
    // Te pagaram um pacote de bolacha para fazer um sistema que ajude seu professor a calcular a média de cada aluno para preenchimento
    // no sistema de nota da sua faculdade, além disso, valendo uma paçoca seu professor solicitou que o sistema indicasse se o aluno
    // foi aprovado ou não 
    let condicionalLoop: boolean = true
    while(condicionalLoop){
        let { nota1, nota2, nome } = await ColetaDadosDoAluno(rl);
        let media: number = CalcularMedia(nota1, nota2)
        ExibirResultadoFinalAluno(media, nome)
        condicionalLoop = await LoopDeveContinuar(condicionalLoop, rl);
    }
    rl.close()    
};

main();