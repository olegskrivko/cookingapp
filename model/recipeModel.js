const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
// set thumbnail img size
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload", "/upload/w_200");
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [60, "Title can have up to 60 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description can have up to 500 characters"],
  },
  ingredients: [
    {
      name: {
        type: String,
        required: [true, "Ingredient name is required"],
        trim: true,
        lowercase: true,
        maxlength: [50, "Ingredient can have up to 50 characters"],
      },
      quantity: {
        type: Number,
        required: [true, "Ingredient quantity is required"],
        min: [0, "Ingredient quantity must be a positive number"],
        max: [1000, "Ingredient quantity cannot exceed 1000"],
        default: 0,
      },
      unit: {
        type: String,
        enum: ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pcs"],
        required: [true, "Ingredient quantity unit is required"],
      },
      required: {
        type: Boolean,
        default: true,
      },
    },
  ],
  instructions: [
    {
      step: {
        type: String,
        required: [true, "Instruction step is required"],
        trim: true,
      },
    },
  ],
  prepTime: {
    type: Number,
    required: [true, "Preparation time is required"],
    min: [0, "Preparation time must be a positive number"],
    max: [1440, "Preparation time cannot exceed 24h"],
    default: 0,
  },
  cookTime: {
    type: Number,
    required: [true, "Cooking time is required"],
    min: [0, "Cooking time must be a positive number"],
    max: [1440, "Preparation time cannot exceed 24h"],
    default: 0,
  },
  totalTime: {
    type: Number,
    min: [0, "Cooking time must be a positive number"],
    default: 0,
  },
  servings: {
    type: Number,
    required: [true, "Servings is required"],
    min: [1, "Servings must be a positive number"],
    max: [16, "Servings cannot exceed 16"],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Expert"],
    required: [true, "Difficulty level is required"],
  },
  // tags: [
  //   {
  //     type: String,
  //     lowercase: true,
  //     trim: true,
  //   },
  // ],
  cuisines: {
    type: [String], // Array of strings
    validate: {
      validator: function (cuisines) {
        return cuisines.length <= 3;
      },
      message: "Maximum of 3 cuisines allowed",
    },
  },

  mealTypes: [
    {
      type: String,
    },
  ],
  dishTypes: [
    {
      type: String,
    },
  ],
  allergens: [
    {
      type: String,
    },
  ],
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  // dislikes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  // comments: [
  //   {
  //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //     comment: {
  //       type: String,
  //       required: [true, "Comment is required"],
  //       trim: true,
  //     },
  //     createdAt: { type: Date, default: Date.now },
  //     updatedAt: { type: Date, default: Date.now },
  //   },
  // ],
  image: imageSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the pre-save hook
recipeSchema.pre("save", function (next) {
  // Calculate the total time by summing the cooking time and preparation time
  this.totalTime = this.cookTime + this.prepTime;
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
