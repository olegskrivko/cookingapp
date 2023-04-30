const recipeForm = document.querySelector("#recipe-form");
const ingredientContainer = document.querySelector(".ingredient-container");
const instructionContainer = document.querySelector(".instruction-container");

const addIngredientBtn = document.querySelector("#add-ingredient-btn");
const addInstructionBtn = document.querySelector("#add-instruction-btn");

const deleteIngredientBtn = document.querySelector(".delete-ingredient-btn");
const deleteInstructionBtn = document.querySelector(".delete-instruction-btn");

const ingredientTemplate = document.querySelector("#ingredient-template");
const instructionTemplate = document.querySelector("#instruction-template");

let ingredientCount = 1;
let instructionCount = 1;

// function to add new ingredient
function addIngredientElement() {
  let ingredient = ingredientTemplate.content.cloneNode(true);
  ingredient.querySelector(".ingredient-checkbox").setAttribute("id", `ingredientCheckbox${ingredientCount}`);
  ingredient.querySelector(".ingredient-checkbox-label").setAttribute("for", `ingredientCheckbox${ingredientCount}`);
  ingredient
    .querySelector(".ingredient-checkbox")
    .setAttribute("name", `ingredients[required][item${ingredientCount}]`);
  ingredient.querySelector(".ingredient-input").setAttribute("id", `ingredient${ingredientCount}`);
  ingredient.querySelector(".ingredient-input").setAttribute("list", `suggestion-list${ingredientCount}`);
  // fix data list
  ingredient.querySelector(".suggestion-list").setAttribute("id", `suggestion-list${ingredientCount}`);

  ingredientContainer.appendChild(ingredient);
}

function addInstructionElement() {
  let instruction = instructionTemplate.content.cloneNode(true);

  instruction.querySelector(".instruction-input").setAttribute("id", `instruction${instructionCount}`);
  instruction.querySelector(".instruction-nbr").innerText = `Step ${instructionCount}`;
  instructionContainer.appendChild(instruction);
}

// Add 1 ingredient input element on page load
(function () {
  fixIngredientAttributes();
})();

// Add 1 instruction element on page load
(function () {
  fixInstructionAttributes();
})();

function fixIngredientAttributes() {
  // fix remaining ingredient attributes: name, id, and label after user deletes some random ingredient
  let allCheckboxes = document.querySelectorAll(".ingredient-checkbox");
  let allIngredientInputs = document.querySelectorAll(".ingredient-input");
  let allIngredientLabels = document.querySelectorAll(".ingredient-checkbox-label");
  let allIngredientsDatalists = document.querySelectorAll(".suggestion-list");

  let indexLabels = 1;
  let indexCheckbox = 1;
  let indexIngredient = 1;
  let indexDatalist = 1;

  allCheckboxes.forEach((item) => {
    item.setAttribute("name", `ingredients[required][item${indexCheckbox}]`);
    item.setAttribute("id", `ingredientCheckbox${indexCheckbox}`);
    indexCheckbox++;
  });

  allIngredientLabels.forEach((item) => {
    item.setAttribute("for", `ingredientCheckbox${indexLabels}`);
    indexLabels++;
  });

  allIngredientInputs.forEach((item) => {
    item.setAttribute("id", `ingredient${indexIngredient}`);
    item.setAttribute("list", `suggestion-list${indexIngredient}`);
    indexIngredient++;
  });

  allIngredientsDatalists.forEach((item) => {
    item.setAttribute("id", `suggestion-list${indexDatalist}`);
    indexDatalist++;
  });
}

function fixInstructionAttributes() {
  let allInstructionInputs = document.querySelectorAll(".instruction-input");
  let instructionNbrs = document.querySelectorAll(".instruction-nbr");
  let indexInstruction = 1;
  let indexStepNbr = 1;

  allInstructionInputs.forEach((item) => {
    item.setAttribute("id", `instruction${indexInstruction}`);
    indexInstruction++;
  });

  instructionNbrs.forEach((item) => {
    item.innerText = `Step ${indexStepNbr}`;
    indexStepNbr++;
  });
}

// Add new ingredient element
addIngredientBtn.addEventListener("click", () => {
  addIngredientElement();
  fixIngredientAttributes();
});

// Add new instruction element
addInstructionBtn.addEventListener("click", () => {
  addInstructionElement();
  fixInstructionAttributes();
});

// Bind the event to the parent element
recipeForm.addEventListener("click", function (event) {
  // check the delete button was clicked
  if (event.target.dataset.action === "delete") {
    // remove parent element (remove input field)
    const delBtnParent = event.target.parentElement;
    delBtnParent.remove();
    // fix attributes after deleting
    fixIngredientAttributes();
    fixInstructionAttributes();
  }
});
