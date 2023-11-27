const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const send = require("send");
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
const Recipes = require("./models/Recipes");
const Cat = require("./models/Category");
const Img = require("./models/Images");
const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })
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
    Recipes.find({name: req.params.food})
    .then((result) => {
        return res.send(result[0]);
    });
})

console.log(mongoose.connection.readyState);

app.get("/categories", (req, res) =>{
    Cat.find({})
    .then(result => {
        console.log(result);
        return res.json(result);
    })
})

app.post("/recipe/", (req, res, next) => {
    console.log(req.body);
    Recipes.findOne({name: req.body.name})
    .then((name) =>{
        if(!name) {
            new Recipes({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients,
                categories: req.body.categories
            }).save()
        } else {
            return res.status(403).send("Have this recipe");
        }
    }).catch((err)=>{
        console.log(err);
    });
})

app.post("/images", upload.single('uploaded_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    let imgToSend = {
      name: req.file.fieldname,
      buffer: req.file.buffer,
      mimetype: req.file.type,
      encoding: req.file.encoding
    }
    console.log(imgToSend);
    console.log(req.file, req.body) 
    // (req, res) => {
    // images.push(req.body)
    // console.log(req.body);
    // res.send("Hi");
})


app.listen(port, () => console.log("Server listen"))
console.log(mongoose.connection.readyState);