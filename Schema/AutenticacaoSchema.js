import joi from "joi";

export const loginUsuarioSchema = joi.object({
    email: joi.string().email().required(),
    senha:joi.string().required()
});

export const cadastroUsuarioSchema = joi.object({
    nome: joi.string().required().min(3),
    email: joi.string().email().required(),
    senha: joi.string().required(),
    confirmacaoDeSenha: joi.ref("senha")
});