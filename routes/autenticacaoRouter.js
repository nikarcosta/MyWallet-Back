import { Router } from "express";

import { cadastrarUsuario, logarUsuario, deslogarUsuario } from "../controllers/autenticacaoController.js";
import { cadastroUsuarioSchema, loginUsuarioSchema } from "../Schema/AutenticacaoSchema.js";
import { validarSchema } from "../middlewares.js/validacaoSchemaMiddleware.js";

const autenticacaoRouter = Router();


autenticacaoRouter.post("/cadastro", validarSchema(cadastroUsuarioSchema), cadastrarUsuario);
autenticacaoRouter.post("/entrar", validarSchema(loginUsuarioSchema), logarUsuario);
autenticacaoRouter.put("/logout", deslogarUsuario);


export default autenticacaoRouter;