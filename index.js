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
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ dest: './public/data/uploads/' })
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
// let listValue = [];
const images = [];
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;

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
        // console.log(result);
        return res.json(result);
    })
})

app.post("/recipe/", (req, res, next) => {
    // console.log(req.body);
    Recipes.findOne({name: req.body.name})
    .then((name) =>{
        if(!name) {
            new Recipes({
                name: req.body.name,
                instructions: req.body.instructions,
                ingredients: req.body.ingredients,
                categories: req.body.categories,
                images: req.body.images
            }).save()
        } else {
            return res.status(403).send("Have this recipe");
        }
    }).catch((err)=>{
        console.log(err);
    });
})

app.post("/images", upload.array("images"), (req, res) => {
    Img.findOne({name: req.files[0].originalname})
    .then((name) => {
        if(!name) {
            let newImg = new Img({
                    name: req.files[0].originalname,
                    buffer: req.files[0].buffer.toString('binary'),
                    mimetype: req.files[0].mimetype,
                    encoding: req.files[0].encoding
                });
            let idSave = newImg._id.toString();
            newImg.save();
            let result = {"id": idSave};
            return res.send(result);
        } else {
            return res.status(403).send("Have this image");
        }
    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/images/:imageId", (req, res) => {
    Img.findById(req.params.imageId)
    .then((result) => {
        console.log("паппапапапа");
        // console.log(result);
        return res.send(result);
    })
});



app.listen(port, () => console.log("Server listen"))
console.log(mongoose.connection.readyState);