import express from "express";
import cors from "cors";
import movimentacoesRouter from "./routes/movimentacoesRouter.js";
import autenticacaoRouter from "./routes/autenticacaoRouter.js";



const server = express();

server.use(express.json());
server.use(cors());


server.use(autenticacaoRouter);
server.use(movimentacoesRouter);


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});