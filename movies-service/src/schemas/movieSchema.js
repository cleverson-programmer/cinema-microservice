const Joi = require('joi')
//Schema de validação de dados para nossa API, esse schema vai ser usado no middleware que fica na api nas rotas antes da função que de fato trata a rota
const schema = Joi.object({
        titulo: Joi.string()
            .required()
            .min(2)
            .max(150),
        sinopse: Joi.string()
            .required()
            .min(10)
            .max(500), 
        duracao: Joi.number()
            .integer()
            .min(10)
            .required(),
        dataLancamento: Joi.date()
            .required(),
        imagem: Joi.string()
            .required()
            .pattern(/http?s:\/\/.+\.(jpe?g|png|gif|svg)/i),
        categorias:Joi.array()
            .items(Joi.string())
            .required()
})

module.exports = { schema }