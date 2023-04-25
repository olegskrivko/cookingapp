const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const multer = require("multer");
//const upload = multer({ dest: "uploads/" });
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const router = express.Router();

router.get("/new", recipeController.renderNewForm);
// Get all recipes
router.get("/", recipeController.getAllRecipes);
// router.get("/", authController.protect, recipeController.getAllRecipes);
// Get a recipe by id
router.get("/:id", recipeController.getRecipeById);
// Create a new recipe
router.post("/", upload.single("image"), recipeController.createRecipe);
// router.post("/", upload.single("image"), (req, res) => {
//   console.log(req.body, req.file);
//   res.send("it worked");
// });
// Update a recipe by id
router.put("/:id", upload.single("image"), recipeController.updateRecipe);
// Delete a recipe by id
router.delete("/:id", recipeController.deleteRecipe);

router.get("/:id/edit", recipeController.renderEditForm);

module.exports = router;
