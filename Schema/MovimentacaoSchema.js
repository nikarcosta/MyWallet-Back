import joi from "joi";

export const movimentacaoSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    tipo:joi.string().required()
});