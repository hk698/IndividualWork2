const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use((request, respond, next) =>{
    console.log(request.url);
    next();
})

let db;
MongoClient.connect('mongodb+srv://hk698:hk3270343900@cluster0.1jaim.mongodb.net/IndividualWork2?retryWrites=true&w=majority', (error, client) => {
 if (error) return console.log("wth")
db = client.db('IndividualWork2')
});

app.listen(3000);