//Script do ttl index via mongoshell (pode ser feito no mongo compass)

//db.nomedacoleção.createIndex
db.blacklist.createIndex({
    //Nosso campo de data que no código recebe um new Date(), aqui estamos definindo em ordem crescente (=1)
    data: 1
}, {
    //Tempo que a engine do banco vai apagar os dados salvos, monitora DE 1 EM 1 MIN
    expireAfterSeconds: 1800
})