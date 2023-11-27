const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipes = new Schema({
    name: String,
    instructions: [],
    ingredients: [],
    categories: [],
    images: []
});

module.exports = mongoose.model("Recipes", recipes);