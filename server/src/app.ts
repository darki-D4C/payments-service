import express from "express";
import { Db, MongoClient } from "mongodb";
import cors from "cors";
const app = express();

const port = 8080; // default port to listen
const dbUrl = `mongodb://localhost/payments`;
let dbo : Db;


MongoClient.connect(dbUrl,(err, db) => {
    dbo = db.db("payments");
    if (err) throw err;
});

const insertPayment = async (payment: any) => {
    const collection = dbo.collection('payments')
    const result = await collection.insertOne(payment)
    return {id:result.insertedId,amount:payment.amount}
}

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors({origin: "*"}));

app.use((req,res,next) =>{
    if(!("card_number" in req.body && "exp_date" in req.body && "cvv" in req.body && "amount" in req.body)){
        return res.status(404).send({error:"missing_fields"});
    }
    next();
})

app.post( "/process", async ( req, res ) => {
    console.log(req.body)
    const jsonObj = await insertPayment(req.body)
    console.log(jsonObj)
    res.send(jsonObj);
} );

app.listen( port, () => {
    console.log( `Server started at http://localhost:${ port }` );
} );