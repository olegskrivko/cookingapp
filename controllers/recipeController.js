const Recipe = require("../model/recipeModel");
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
  res.status(200).render("recipes/show", {
    recipe,
  });
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     data: recipe,
  //   },
  // });
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
  const image = req.file;
  //console.log(image);
  const imageFormated = { url: image.path, filename: image.filename };

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
    quantity: Number(ingredientsInputFields.quantity[index]),
  }));
  const ingredientsUnits = ingredientsInputFields.unit.map((unit, index) => ({
    unit: ingredientsInputFields.unit[index],
  }));
  const ingredientsRequired = ingredientsRequiredFields.map((value) => ({
    required: value,
  }));

  // console.log(ingredientsRequiredFields);
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

  // replace timers with tips??
  // const instructionsTimers = instructionsInputFields.timer.map(
  //   (timer, index) => ({
  //     timer: Number(instructionsInputFields.timer[index]),
  //   })
  // );
  // const instructionsFormated = instructionsSteps.map((step, index) => {
  //   return { ...step, ...instructionsTimers[index] };
  // });

  const recipe = await Recipe.create({
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
    image: imageFormated,
  });
  res.redirect(`/api/recipes/${recipe._id}`);
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     data: recipe,
  //   },
  // });
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Extract the fields to update from req.body.recipe
  const {
    title,
    description,
    prepTime,
    servings,
    cookTime,
    difficulty,
    cuisines,
    mealTypes,
    dishTypes,
    allergens,
    image,
  } = req.body;

  const instructionsInputFields = req.body.instructions;

  const instructionsFormated = instructionsInputFields.step.map((step, index) => ({
    step: instructionsInputFields.step[index],
  }));

  const ingredientsInputFields = req.body.ingredients;
  //console.log(ingredientsInputFields)
  // count ingredient name to know how many checkboxes expect, then loop
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
  //console.log(ingredientsRequiredFields);
  const ingredientsNames = ingredientsInputFields.name.map((step, index) => ({
    name: ingredientsInputFields.name[index],
  }));

  const ingredientsQuantities = ingredientsInputFields.quantity.map((quantity, index) => ({
    quantity: Number(ingredientsInputFields.quantity[index]),
  }));
  const ingredientsUnits = ingredientsInputFields.unit.map((unit, index) => ({
    unit: ingredientsInputFields.unit[index],
  }));
  console.log(ingredientsUnits);
  // // const ingredientsRequiredFields = ingredientsRequired.required.map(
  // //   (required, index) => ({
  // //     required: Boolean(ingredientsInputFields.required[index]),
  // //   })
  // // );
  const ingredientsRequired = ingredientsRequiredFields.map((value) => ({
    required: value,
  }));

  // //console.log(ingredientsRequiredFields);
  const ingredientsFormated = ingredientsNames.map((name, index) => {
    return {
      ...name,
      ...ingredientsQuantities[index],
      ...ingredientsUnits[index],
      ...ingredientsRequired[index],
    };
  });
  // console.log(ingredientsFormated);

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
    image,
  };
  // image should be as req.file and not req.body or req.files. because only 1 pic
  // cousine, mealtype, alergens is not working as prefilled

  const recipe = await Recipe.findByIdAndUpdate(id, update);
  await recipe.save();
  //console.log(recipe);
  res.redirect(`/api/recipes/${recipe._id}`);
});

// const updatedRecipe = await Recipe.findByIdAndUpdate(
//   req.params.id,
//   req.body,
//   {
//     new: true,
//     runValidators: true,
//   }
// );

// if (!updatedRecipe) {
//   return next(new AppError("No recipe found with that ID", 404));
// }

// res.json(200).json({
//   status: "success",
//   data: {
//     data: updatedRecipe,
//   },
// });

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!deletedRecipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }
  res.redirect("/api/recipes");

  // res.status(204).json({
  //   status: "success",
  //   data: null,
  // });
});
