import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

let db;

try {
    
    await mongoClient.connect();
    db = mongoClient.db();

} catch (error) {

    console.log("Erro no servidor");
    
}

const server = express();

server.use(express.json());
server.use(cors());


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});