const winston = require('winston')
const path = require('path')//Modulo nativo para manipulação de arquivos

//Criando um logger personalizado passando as configurações do meu logger
const logger = winston.createLogger({
    //Definindo os formatos aceitos
    format: winston.format.combine(
        //Inclui nos erros o stack que é os rastros(linhas, colunas e dados dos erros)
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    //Opção mais comum e barata, salvando os dados em arquivos, não escala muito bem
    transports: [
        //Logs para error e para auditoria de segurança de quem adicionou/removeu filmes

        new winston.transports.File({
            filename: path.join(__dirname, '..', 'logs', 'error.log'),
            level:'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '..', 'logs', 'info.log'),
            level:'info'
        }),


    ]
})

//Node_ENV é a variável padrão de ambiente de produção, com ela podemos verificar se estamos em ambiente de produção ou não
if(process.env.NODE_ENV !== 'production'){
    logger.add( new winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports =  logger 