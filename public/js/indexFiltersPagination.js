// let searchFormBtn = document.querySelector(".search-form-btn");
// let resetFormBtn = document.querySelector(".reset-form-btn");
// let paginationBtn = document.querySelector(".pagination-btn");

// let filterRecipeTitle = document.querySelector("#searchTitle");
// let filterMealType = document.querySelector("#mealType");
// let filterDishType = document.querySelector("#dishType");
// let filterCuisine = document.querySelector("#cuisines");
// let filterTotalCookingTime = document.querySelector("#totalTime");

// let prev = document.querySelector(".prev");
// let next = document.querySelector(".next");

// function saveFiltersToLocaleStorage() {
//   filterRecipeTitle = document.querySelector("#searchTitle").value;
//   filterMealType = document.querySelector("#mealType").value;
//   filterDishType = document.querySelector("#dishType").value;
//   filterCuisine = document.querySelector("#cuisines").value;
//   filterTotalCookingTime = document.querySelector("#totalTime").value;

//   // Store filter options
//   const filterOptionsState = {
//     filterRecipeTitle,
//     filterMealType,
//     filterDishType,
//     filterCuisine,
//     filterTotalCookingTime,
//   };
//   localStorage.setItem("filterOptionsState", JSON.stringify(filterOptionsState));
// }

// //need to fix
// //saveFiltersToLocaleStorage()

// function removeFiltersFromLocaleStorage() {
//   // Check if the item exists in the local storage
//   if (localStorage.getItem("filterOptionsState")) {
//     // Remove the item from the local storage
//     localStorage.removeItem("filterOptionsState");
//     console.log("Filters removed from the local storage.");
//   }
// }

// function clearFormFilterValues() {
//   filterRecipeTitle.value = "";
//   filterMealType.selectedIndex = -1;
//   filterDishType.selectedIndex = -1;
//   filterCuisine.selectedIndex = -1;
//   filterTotalCookingTime.value = "";
// }

// searchFormBtn.addEventListener("click", () => {
//   saveFiltersToLocaleStorage();
// });

// resetFormBtn.addEventListener("click", () => {
//   removeFiltersFromLocaleStorage();
//   clearFormFilterValues();
// });

// // Store pagination state
// let currentPage = 1;
// const pageSize = 6;
// const paginationState = { currentPage, pageSize };
// //localStorage.setItem('paginationState', JSON.stringify(paginationState));

// next.addEventListener("click", (e) => {
//   e.preventDefault();

//   let customPaginationValue = document.querySelector(".custom-pagination-value").value;
//   customPaginationValue++;
//   // Retrieve filter options
//   if (localStorage.getItem("filterOptionsState")) {
//     let filterOptions = JSON.parse(localStorage.getItem("filterOptionsState"));
//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     let urltogo =
//       startURL +
//       `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}&search=${encodeURI(
//         filterOptions.filterRecipeTitle
//       )}&mealTypes=${encodeURI(filterOptions.filterMealType)}&dishTypes=${encodeURI(
//         filterOptions.filterDishType
//       )}&cuisines=${encodeURI(filterOptions.filterCuisine)}&totalTime=${encodeURI(
//         filterOptions.filterTotalCookingTime
//       )}`;
//     window.location.href = urltogo;
//   } else {
//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     let urltogo = startURL + `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}`;
//     window.location.href = urltogo;
//   }
// });

// prev.addEventListener("click", (e) => {
//   e.preventDefault();
//   //currentPage -= 1

//   let customPaginationValue = document.querySelector(".custom-pagination-value").value;
//   customPaginationValue--;
//   // Retrieve filter options
//   if (localStorage.getItem("filterOptionsState")) {
//     let filterOptions = JSON.parse(localStorage.getItem("filterOptionsState"));
//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     let urltogo =
//       startURL +
//       `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}&search=${encodeURI(
//         filterOptions.filterRecipeTitle
//       )}&mealTypes=${encodeURI(filterOptions.filterMealType)}&dishTypes=${encodeURI(
//         filterOptions.filterDishType
//       )}&cuisines=${encodeURI(filterOptions.filterCuisine)}&totalTime=${encodeURI(
//         filterOptions.filterTotalCookingTime
//       )}`;
//     window.location.href = urltogo;
//   } else {
//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     let urltogo = startURL + `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}`;
//     window.location.href = urltogo;
//   }
// });

// paginationBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   let customPaginationValue = document.querySelector(".custom-pagination-value").value;
//   // Retrieve filter options
//   if (localStorage.getItem("filterOptionsState")) {
//     let filterOptions = JSON.parse(localStorage.getItem("filterOptionsState"));

//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     console.log("startURL", startURL);

//     let urltogo =
//       startURL +
//       `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}&search=${encodeURI(
//         filterOptions.filterRecipeTitle
//       )}&mealTypes=${encodeURI(filterOptions.filterMealType)}&dishTypes=${encodeURI(
//         filterOptions.filterDishType
//       )}&cuisines=${encodeURI(filterOptions.filterCuisine)}&totalTime=${encodeURI(
//         filterOptions.filterTotalCookingTime
//       )}`;
//     window.location.href = urltogo;
//   } else {
//     let currentUrl = window.location.href;
//     let startURL = currentUrl.split("?")[0];
//     console.log("startURL", startURL);

//     let urltogo = startURL + `?page=${encodeURI(customPaginationValue)}&limit=${encodeURI(pageSize)}`;
//     window.location.href = urltogo;
//   }
// });
