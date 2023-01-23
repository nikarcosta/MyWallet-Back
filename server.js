import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

let db;

try {
    
    await mongoClient.connect();
    db = mongoClient.db();

} catch (err) {

    console.log("Erro no servidor!");

}

const server = express();

server.use(express.json());
server.use(cors());



const cadastroUsuarioSchema = joi.object({
    nome: joi.string().required().min(3),
    email: joi.string().email().required(),
    senha: joi.string().required(),
    confirmacaoDeSenha: joi.ref("senha")
});


const loginUsuarioSchema = joi.object({
    email: joi.string().email().required(),
    senha:joi.string().required()
});

const movimentacaoSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    tipo:joi.string().required()
});


server.post("/cadastro", async(req, res) => {

   const usuario = req.body;
   const { error } = cadastroUsuarioSchema.validate(usuario, { abortEarly: false});


   if(error) { 
     
    const errors = error.details.map((detail) => detail.message);

    return res.status(422).send(errors);
   }



   const { nome, email, senha, confirmacaoDeSenha } = usuario;



   try {

    const usuarioExiste = await db.collection("usuarios").findOne({ email});

    if(usuarioExiste) return res.status(409).send("Usuário já existe!");

    await db.collection("usuarios").insertOne({
        nome,
        email,
        senha:bcrypt.hashSync(senha, 10)
    });

    return res.status(201).send("Usuário cadastrado com sucesso!");

   } catch(err) {

    console.log(err);

    res.status(500).send("Erro no servidor!");

   }

});


server.post("/entrar", async (req,res) => {

    const usuario = req.body;

    const { error } = loginUsuarioSchema.validate(usuario, {abortEarly: false});

    if(error){

        const errors = error.details.map((detail) => detail.message);
        
        return res.status(422).send(errors);
    }

    const { email, senha } = usuario;

    try{

        const usuario = await db.collection("usuarios").findOne({ email });


        if(!usuario) return res.status(422).send("Usuário não encontrado");


        if(usuario && bcrypt.compareSync(senha, usuario.senha)){    
            
            
            const token = uuid();

            await db.collection("sessoes").insertOne({
                idUsuario: usuario._id,
                token
            });
              
            return res.send(token);

        } else {
            return res.status(401).send("Senha ou usuário incorretos");
        }
    } catch (error) {

        console.log(error);

        res.status(500).send("Erro no servidor!");

    }



});


server.post("/movimentacoes", async (req, res) => {
    const movimentacao = req.body;

    const { error } = movimentacaoSchema.validate(movimentacao, { abortEarly: false });

    if(error){

        const errors = error.details.map((detail) => detail.message);

        return res.status(422).send(errors);
    }

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


});


server.get("/minhas-transacoes", async (req, res) => {

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
});


server.put("/logout", async (req, res) => {
   
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection("sessoes").findOne({ token });

    if(!sessao) return res.sendStatus(401);

    try{

        await db.collection("sessoes").deleteOne({ _id: new ObjectId(sessao._id)});

        return res.send("Logout realizado com sucesso");

    } catch(err) {

        console.log(err);

        res.status(500).send("Erro no servidor!");
    }

    
});

const PORT = 5001;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});