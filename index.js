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
const multer  = require('multer');
const storage = multer.memoryStorage();
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

app.post("/images", upload.array("images"), async (req, res) => {
    console.log(req.files);
    // console.log(req.body);
    let idSave = [];
    for (let i=0; i<req.files.length; i++) {
        await Img.findOne({name: req.files[i].originalname})
        .then((name) => {
            if(!name) {
                let newImg = new Img({
                    name: req.files[i].originalname,
                    buffer: req.files[i].buffer,
                    mimetype: req.files[i].mimetype,
                    encoding: req.files[i].encoding
                });
                idSave.push(newImg._id.toString());
                console.log(idSave)
                newImg.save();
            } else {
                return res.status(403).send("Have this image");
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    let result = {"id": idSave};
    console.log(result)
    return res.send(result);
});

app.get("/images/:imageId", (req, res) => {
    Img.findById(req.params.imageId)
    .then((result) => {
        console.log("паппапапапа");
        res.setHeader("Content-Disposition", "inline" + ";" + 'filename=' + result.name);
        res.setHeader("Content-Type", result.mimetype);
        return res.send(result.buffer);
    })
});



app.listen(port, () => console.log("Server listen"))
console.log(mongoose.connection.readyState);