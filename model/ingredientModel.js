const mongoose = require("mongoose");

// Define the Ingredient schema
const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
  },
  vitamins: [
    {
      name: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  ],
  notes: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
});

// Create the Ingredient model
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
