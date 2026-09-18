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
