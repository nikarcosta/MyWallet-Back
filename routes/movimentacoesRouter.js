import { Router } from "express";

import { cadastrarMovimentacao, buscarTransacoes } from "../controllers/movimentacoesController.js";
import { movimentacaoSchema } from "../Schema/MovimentacaoSchema.js"
import { validarSchema } from "../middlewares.js/validacaoSchemaMiddleware.js";



const movimentacoesRouter = Router();

movimentacoesRouter.post("/movimentacoes", validarSchema(movimentacaoSchema), cadastrarMovimentacao);
movimentacoesRouter.get("/movimentacoes", buscarTransacoes);

export default movimentacoesRouter;