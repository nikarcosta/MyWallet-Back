import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

let db;

try {
    
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("Conexão com o banco de dados estabelecida!");

} catch (err) {

    console.log("Erro ao se conectar ao servidor!", err);

}

export default db;