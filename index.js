const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const send = require("send");
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
const Recipes = require("./models/Recipes");
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
// let listValue = [];
const images = [];
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended: true })) ;

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

app.use(express.static(path.join(__dirname, "public")));


app.get("/recipe/:food", (req, res) => {
    let FoodId = req.params.food;
    console.log(req.params.food);
    let el = {
        name: FoodId, 
        instructions: ["mix", "roll", "eat"],
        ingredients: ["cheese", "flour"]
    };
    console.log(el);
    res.send(el);
})

console.log(mongoose.connection.readyState);

app.post("/recipe/", (req, res, next) => {
    // listValue.push(req.body);
    // console.log(req.body);
    Recipes.findOne({name: req.body.name})
    .then((name) =>{
        console.log(mongoose.connection.readyState);
        console.log("pupu");
        if(!name) {
            new Recipes({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients
            }).save(function(err,result){ 
                if (err){ 
                    console.log(err); 
                } 
                else{ 
                    console.log(result) 
                } 
            })
        } else {
            return res.status(403).send("Have this recipe");
        }
    }).catch((err)=>{
        console.log(err);
    });
})

app.post("/images", (req, res) => {
    images.push(req.body)
    console.log(req.body);
    res.send("Hi");
})


app.listen(port, () => console.log("Server listen"))
console.log(mongoose.connection.readyState);