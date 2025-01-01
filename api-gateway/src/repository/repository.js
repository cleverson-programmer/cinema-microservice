const database = require('../config/database')
const bcrypt = require('bcryptjs')

async function getUser(email, password) {
    const db = await database.connect();

    const user = await db.collection('users')
        .findOne({ email })

    if(!user) throw new Error('Wrong user and/or password')

    //Se veio a senha, fazemos a comparação para ver se bate com a criptografia
    //Passa a senha do texto plano vinda da requisição e passa a senha criptografada do banco de dados, a criptografia hash de senha não consegue retornar a senha original digitada pelo usuário, mas consegue comparar se duas criptografias são iguais
    const isValid = bcrypt.compareSync(password, user.password)
    if(!isValid) throw new Error('Wrong user and/or password')

    return user
}


//Para não sobrecarregar o banco com todos os tokens blacklistados na hora do logout, nós vamos adicionar um padrão ao mongodb chamado (TTL) Time To Live Index que a partir de um determinado tempo apaga automaticamente os dados do banco, já que esse nosso token JWT já tem a expiração programada de 30 minutos. Essa configuração faz no mongodb compass, na aba indexes, tem criar um indice, passar a ordem crescente e nas options passar create TTL, esse  TTL fica armazenado automaticamente e a propria engine do mongodb monitora esse index
async function blackListToken(token){
    const db = await database.connect()

    return await db.collection('blackList')
        .insertOne({ _id: token, data: new Date()})
    
}

async function checkBlackList(token){
    const db = await database.connect()

    const qtd = await db.collection('blackList')
        .countDocuments({ _id: token})
    return qtd > 0
    
}


module.exports = { 
    getUser,
    blackListToken,
    checkBlackList
}