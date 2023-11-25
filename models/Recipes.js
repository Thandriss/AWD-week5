const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipes = new Schema({
    name: String,
    instructions: [],
    ingredients: []
});

module.exports = mongoose.model("Recipes", recipes);