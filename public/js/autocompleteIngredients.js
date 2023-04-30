// add this logic to backend instead of frontend to hide api
function automcomplete(inputElement) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const apiKey = "dfc2a66c93a14b528b3ccceadd16042d";
  inputElement.addEventListener("input", async (event) => {
    let input = event.target;
    let inputValue = input.value;
    let suggestionList = input.nextElementSibling;
    let suggestionNumber = 10;

    if (inputValue.length >= 2) {
      let response = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}&query=${inputValue}&number=${suggestionNumber}`,
        options
      );
      let data = await response.json();
      suggestionList.innerHTML = "";

      data.forEach((suggestion) => {
        let suggestionOption = document.createElement("option");
        suggestionOption.value = suggestion.name;
        suggestionList.appendChild(suggestionOption);
      });
    } else {
      suggestionList.innerHTML = "";
    }
  });
}
