import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";



export async function cadastrarUsuario(req, res){

    const usuario = req.body;


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
}

export async function logarUsuario(req, res){

    const usuario = req.body;


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

}

export async function deslogarUsuario(req, res){

    
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

}