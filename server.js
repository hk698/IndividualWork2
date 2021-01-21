const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = reuqire('cors');


const app = express();
app.use(express.json());

app.use(cors());
app.use((request, respond, next) =>{
    // respond.header("Access-Control-Allow-Origin", "*");
    // respond.header("Access-Control-Allow-Headers", "*");
    console.log(request.url);
    next();
})

let db;
MongoClient.connect('mongodb+srv://hk698:hk3270343900@cluster0.1jaim.mongodb.net/', (error, client) => {
    if (error) console.log(error)
    db = client.db('IndividualWork2')
});

app.get('/lessons', (request, respond, next) => {
    db.collection('lessons').find({}).toArray((error, results) => {
            if (error) return next();
            respond.json(results);
    });
});

app.post('/order', (request, respond, next) => {
    db.collection('orders').insert(request.body, (error, results) => {
        if (error) return next();
        respond.send(results.ops);
    });
});

app.put('/update/:id', (request, respond, next) => {
   
    db.collection('lessons').update(
        { _id: new ObjectID(request.params.id) },
        { $set: request.body },
        { safe: true, multi: false },
       (error, result) => {
           if (error) return next();
           respond.json({'message': 'all good'})
       }
    )
});

app.use((request, respond) => {
    respond.status(404).json({
        'error': true,
        'message': 'An error has occured'});
});

const port = process.env.PORT || 3000;
app.listen(port);