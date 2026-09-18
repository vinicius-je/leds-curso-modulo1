function ExibirGuiaPreenchimentoNota (){
    console.log("Nota deve ser preenchida com (.), exemplo: 8.5")
}

function ExibirResultadoFinalAluno(media: number, nome: string){
    const NOTA_CORTE: number = 7.0

    if(media < NOTA_CORTE){
        console.log(`O aluno ${nome} foi reprovado com média ${media}`)
        return
    }

    console.log(`O aluno ${nome} foi aprovado com média ${media}`)
}

export = {ExibirGuiaPreenchimentoNota, ExibirResultadoFinalAluno}