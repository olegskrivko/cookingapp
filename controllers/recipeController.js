const { Recipe, validateRecipe } = require("../model/recipeModel");
const { cloudinary } = require("../config/cloudinary");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  unitOptions,
  difficultyOptions,
  allergensOptions,
  mealTypesOptions,
  dishTypesOptions,
  cuisinesOptions,
} = require("../utils/recipeOptions");

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const ITEMS_PER_PAGE = 6; // Number of items to display per page
  const { page, limit, search, totalTime, mealTypes, dishTypes, cuisines } = req.query;

  // Validate and sanitize input parameters
  const currentPage = parseInt(page) || 1;
  const limitPerPage = parseInt(limit) || ITEMS_PER_PAGE;

  // Define filter options for the search query
  const filterOptions = {};
  if (search) {
    filterOptions.title = { $regex: new RegExp(search, "i") }; // Filter by title containing the search value (case-insensitive)
  }
  if (totalTime) {
    filterOptions.totalTime = { $lte: parseInt(totalTime) }; // Filter by cooking time less than the provided value
  }
  if (mealTypes) {
    filterOptions.mealTypes = mealTypes; // Filter by meal type equal to the provided value
  }
  if (dishTypes) {
    filterOptions.dishTypes = dishTypes; // Filter by dish type equal to the provided value
  }
  if (cuisines) {
    filterOptions.cuisines = cuisines; // Filter by dish type equal to the provided value
  }

  // Retrieve total number of recipes for pagination logic
  const totalRecipes = await Recipe.countDocuments(filterOptions);

  // Calculate starting index based on current page and limit
  const startIndex = (currentPage - 1) * limitPerPage;

  // Retrieve recipes for current page with applied filter options
  const recipes = await Recipe.find(filterOptions).skip(startIndex).limit(limitPerPage);

  // Calculate total number of pages based on total recipes and limit per page
  const totalPages = Math.ceil(totalRecipes / limitPerPage);

  // Render response with pagination data
  res.render("recipes", {
    recipes,
    currentPage,
    limitPerPage,
    totalRecipes,
    totalPages,
    searchValue: search,
    totalTimeValue: totalTime,
    mealTypeValue: mealTypes,
    dishTypeValue: dishTypes,
    cuisinesValue: cuisines,
    mealTypesOptions,
    dishTypesOptions,
    cuisinesOptions,
  });
});

exports.getRecipeById = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }
  res.status(200).render("recipes/show", {
    recipe,
  });
});

exports.renderNewForm = (req, res) => {
  res.render("recipes/new", {
    difficultyOptions,
    cuisinesOptions,
    mealTypesOptions,
    dishTypesOptions,
    allergensOptions,
    unitOptions,
  });
};

exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.render("recipes/edit", {
    recipe,
    unitOptions,
    difficultyOptions,
    allergensOptions,
    mealTypesOptions,
    dishTypesOptions,
    cuisinesOptions,
  });
});

exports.createRecipe = catchAsync(async (req, res, next) => {
  const ingredientsInputFields = req.body.ingredients;
  // count ingredient name to know how many checkboxes expect, then loop
  const ingredientsValues = ingredientsInputFields.name;
  const ingredientsLength = Object.keys(ingredientsValues).length;
  const ingredientsRequiredFields = [];
  for (let i = 1; i <= ingredientsLength; i++) {
    if (ingredientsInputFields.required[`item${i}`] === "true") {
      ingredientsRequiredFields.push(true);
    } else {
      ingredientsRequiredFields.push(false);
    }
  }
  const ingredientsNames = ingredientsInputFields.name.map((step, index) => ({
    name: ingredientsInputFields.name[index],
  }));
  const ingredientsQuantities = ingredientsInputFields.quantity.map((quantity, index) => ({
    // ingredientsInputFields should be in converted to Number(), but if value is empty then it automaticaly converted to 0,
    // if user did not add any value it counts as zero. Thats bad
    quantity: Number(ingredientsInputFields.quantity[index]),
  }));
  const ingredientsUnits = ingredientsInputFields.unit.map((unit, index) => ({
    unit: ingredientsInputFields.unit[index],
  }));
  const ingredientsRequired = ingredientsRequiredFields.map((value) => ({
    required: value,
  }));

  const ingredientsFormated = ingredientsNames.map((name, index) => {
    return {
      ...name,
      ...ingredientsQuantities[index],
      ...ingredientsUnits[index],
      ...ingredientsRequired[index],
    };
  });

  const instructionsInputFields = req.body.instructions;

  const instructionsFormated = instructionsInputFields.step.map((step, index) => ({
    step: instructionsInputFields.step[index],
  }));

  const unprocessedBody = {
    title: req.body.title,
    description: req.body.description,
    ingredients: ingredientsFormated,
    instructions: instructionsFormated,
    prepTime: req.body.prepTime,
    servings: req.body.servings,
    cookTime: req.body.cookTime,
    difficulty: req.body.difficulty,
    cuisines: req.body.cuisines,
    mealTypes: req.body.mealTypes,
    dishTypes: req.body.dishTypes,
    allergens: req.body.allergens,
  };

  const { error } = validateRecipe(unprocessedBody);
  if (error) return next(new AppError(error.details[0].message, 400));

  const image = req.file;
  //console.log(image);

  if (image) {
    // this doesnt work, it uploads anyway
    //const cloudinaryRes = await cloudinary.uploader.upload(image.path);
    const recipe = await Recipe.create({
      ...unprocessedBody,
      image: { url: image.path, filename: image.filename },
    });
    res.redirect(`/api/recipes/${recipe._id}`);
  } else {
    const recipe = await Recipe.create({
      ...unprocessedBody,
      image: { url: "", filename: "" },
    });
    res.redirect(`/api/recipes/${recipe._id}`);
  }

  // const recipe = await Recipe.create({
  //   title: req.body.title,
  //   description: req.body.description,
  //   ingredients: ingredientsFormated,
  //   instructions: instructionsFormated,
  //   prepTime: req.body.prepTime,
  //   servings: req.body.servings,
  //   cookTime: req.body.cookTime,
  //   difficulty: req.body.difficulty,
  //   cuisines: req.body.cuisines,
  //   mealTypes: req.body.mealTypes,
  //   dishTypes: req.body.dishTypes,
  //   allergens: req.body.allergens,
  //   image: image ? { url: image.path, filename: image.filename } : { url: "", filename: "" },
  // });

  // res.redirect(`/api/recipes/${recipe._id}`);
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // to get single image use req.file, for multiple images use req.files, but not req.body
  const imageUpdate = req.file;

  // cousine, mealtype, alergens is not working as prefilled (need to fix)
  // Extract the fields to update from req.body.recipe
  const { title, description, prepTime, servings, cookTime, difficulty, cuisines, mealTypes, dishTypes, allergens } =
    req.body;

  // instructions
  const instructionsInputFields = req.body.instructions;
  const instructionsFormated = instructionsInputFields.step.map((step, index) => ({
    step: instructionsInputFields.step[index],
  }));

  // ingredients
  const ingredientsInputFields = req.body.ingredients;
  // count ingredients name to know how many checkboxes expect, then loop
  const ingredientsValues = ingredientsInputFields.name;
  const ingredientsLength = Object.keys(ingredientsValues).length;
  const ingredientsRequiredFields = [];
  for (let i = 1; i <= ingredientsLength; i++) {
    if (ingredientsInputFields.required[`item${i}`] === "") {
      ingredientsRequiredFields.push(true);
    } else {
      ingredientsRequiredFields.push(false);
    }
  }
  // ingredients name
  const ingredientsNames = ingredientsInputFields.name.map((step, index) => ({
    name: ingredientsInputFields.name[index],
  }));
  // ingredients quantity
  const ingredientsQuantities = ingredientsInputFields.quantity.map((quantity, index) => ({
    quantity: Number(ingredientsInputFields.quantity[index]),
  }));
  // ingredients units
  const ingredientsUnits = ingredientsInputFields.unit.map((unit, index) => ({
    unit: ingredientsInputFields.unit[index],
  }));
  // ingredients required
  const ingredientsRequired = ingredientsRequiredFields.map((value) => ({
    required: value,
  }));
  // ingredients formated
  const ingredientsFormated = ingredientsNames.map((name, index) => {
    return {
      ...name,
      ...ingredientsQuantities[index],
      ...ingredientsUnits[index],
      ...ingredientsRequired[index],
    };
  });

  // Create an update object with the fields to update
  const update = {
    title,
    description,
    ingredients: ingredientsFormated,
    instructions: instructionsFormated,
    prepTime,
    servings,
    cookTime,
    difficulty,
    cuisines,
    mealTypes,
    dishTypes,
    allergens,
  };

  // check this code one more time
  const recipe = await Recipe.findByIdAndUpdate(id, update, { new: true, runValidators: true });

  if (imageUpdate) {
    const previousImage = recipe.image;
    const imageFormated = { url: imageUpdate.path, filename: imageUpdate.filename };

    // Add validators to the image field
    const validationOptions = {
      runValidators: true,
      context: "query",
    };

    await recipe.updateOne({ image: imageFormated }, validationOptions);

    await cloudinary.uploader.destroy(previousImage.filename); // delete previous image from cloudinary
  }

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.redirect(`/api/recipes/${recipe._id}`);
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  const relatedCloudinaryImage = recipe.image;
  // delete recipe
  const deletedRecipe = await Recipe.findByIdAndDelete(id);
  // delete related image from cloudinary
  if (deletedRecipe) {
    await cloudinary.uploader.destroy(relatedCloudinaryImage.filename);
  }
  if (!deletedRecipe || !recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }
  res.redirect("/api/recipes");
});
