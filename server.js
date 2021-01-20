const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use((request, respond, next) =>{
    console.log(request.url);
    next();
})

app.listen(3000);