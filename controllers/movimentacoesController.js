import db from "../db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";


export async function cadastrarMovimentacao (req, res) {
 
    const movimentacao = req.body;


    const { valor, descricao, tipo } = movimentacao;

    
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if(!token) return res.sendStatus(401);

    const sessao = await db.collection("sessoes").findOne({token});

    if(!sessao) return res.sendStatus(401);

    try{

        await db.collection("movimentacoes").insertOne({
            idUsuario: sessao.idUsuario,
            valor, 
            descricao,
            tipo,
            data: dayjs().format("DD/MM")
        });


        res.status(201).send(`Nova ${tipo} cadastrada com sucesso!`);

    } catch (err) {

        console.log(err);

        res.status(500).send("Erro no servidor!");
    }    
}

export async function buscarTransacoes(req, res){


    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection("sessoes").findOne({ token });

    if(!sessao) return res.sendStatus(401);

    try{

        const movimentacoesDoUsuario = await db.collection("movimentacoes").find({ idUsuario: new ObjectId(sessao.idUsuario) }).toArray();

        return res.send(movimentacoesDoUsuario);

    } catch(err) {

        console.log(err);

        res.status(500).send("Erro no servidor!");
    }
}