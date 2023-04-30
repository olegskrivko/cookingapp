const mongoose = require("mongoose");
const Joi = require("joi");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: [true, "Image URL is required"] },
  filename: { type: String, required: [true, "Image filename is required"] },
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
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [50, "Title can have up to 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [5, "Description must be at least 5 characters"],
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
        // default: 0,
      },
      unit: {
        type: String,
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
    max: [1440, "Cooking time cannot exceed 24h"],
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
  image: {
    type: imageSchema,
    required: [true, "Image is required"],
    validate: {
      validator: function (value) {
        return value && value.url && value.filename;
      },
      message: "Image URL and filename are required",
    },
  },
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

// JOI VALIDATED SCHEMA
function validateRecipe(recipe) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(500).required(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          quantity: Joi.number().min(0).required(),
          unit: Joi.string().required(),
          required: Joi.boolean().required(),
        })
      )
      .min(1)
      .required(),
    instructions: Joi.array()
      .items(
        Joi.object({
          step: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    prepTime: Joi.number().required(),
    servings: Joi.number().required(),
    cookTime: Joi.number().required(),
    difficulty: Joi.string().valid("Easy", "Medium", "Hard", "Expert").required(),
    cuisines: Joi.array().items(Joi.string()).min(1).required(),
    mealTypes: Joi.array().items(Joi.string()).min(1).required(),
    dishTypes: Joi.array().items(Joi.string()).min(1).required(),
    allergens: Joi.array().items(Joi.string()),
  });
  return schema.validate(recipe);
}

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = {
  Recipe,
  validateRecipe,
};

//Joi validation can be used to ensure that data is valid before it is sent to the server,
//while Mongoose validation can be used to ensure that the data is valid before it is saved to the database.
//This can provide an extra layer of security and ensure that data is always in the correct format and meets certain requirements.
