const get = (element) => document.querySelector(element);
const getAll = (element) => document.querySelectorAll(element);
//input text
const userInput = get("#user-input");
const btn = get("#button");
//ul autocomplete
const autocomplete = get("#autocomplete");
//form
const formSearchBar = get("#searchbar");
const ErrorMessage = get("#error-message");
//Array that holds all the name's of the cities available data
const cities = [];
let city = "";

//output elements
const background = get("#background-photo");
const titleDisplay = get("#city-data-title");
const summaryDisplay = get("#city-data-summary");
const categoriesDisplay = get("#city-data-categories");
const scoreDisplay = get("#city-data-score");

async function loadCities() {
  try {
    let response = await fetch(`https://api.teleport.org/api/urban_areas/`);
    let data = await response.json();
    if (response.status != 404) {
      console.log(response.status);
      data._links["ua:item"].forEach((city) => cities.push(city.name));
    } else {
      throw new Error("fetch");
    }
  } catch (error) {
    ErrorMessage.textContent = "Network Error";
  }
}

loadCities();

// border
function menu() {
  userInput.style.borderRadius = "25px";
}

//  reset
function reset() {
  userInput.value = "";
  menu();
}

//for the first 5 matching values and displays them inside the ul
function autocompleteUserInput() {
  if (userInput.value != "" && userInput === document.activeElement) {
    userInput.style.borderRadius = "24px 24px 0 0 ";
    let citiesHtml = [];
    cities.forEach((city) => {
      if (city.toLowerCase().includes(userInput.value.toLowerCase())) {
        citiesHtml.push(
          `<li class="autocomplete-item" id="autocomplete-item">${city}</li>`
        );
      }
    });
    autocomplete.innerHTML = citiesHtml.slice(0, 5).join("");
  } else {
    autocomplete.innerHTML = "";
  }
}


//data of the selected city
function handleClickOnSuggestedCities(e) {
  userInput.value = e.target.textContent;
  autocomplete.innerHTML = "";
  ErrorMessage.textContent = "";
  startSearch();
}

function onSubmit(e) {
  e.preventDefault();

  if (userInput.value === "" || userInput.value === " ") {
    ErrorMessage.textContent = "Type something to start the search!";
  } else {
    ErrorMessage.textContent = "";
    startSearch();
  }
}

async function startSearch() {
  let city = userInput.value
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(",", "")
    .replaceAll(".", "");
  menu();

  try {
    photo = await fetchPhoto(city);
    displayPhoto(photo);
    cityData = await fetchData(city);
    displaycityData(cityData);
    ChangeCityCss();
  } catch (error) {
    ErrorMessage.textContent =
      "City not found, if the city requested is not among the suggested ones its data is not available";
  }
}

async function fetchPhoto(city) {
  let photoUrl = new URL(
    `https://api.teleport.org/api/urban_areas/slug:${city}/images/`
  );
  let response = await fetch(photoUrl);
  let photo = await response.json();
  if (response.status != 404) return photo;
  else throw new Error("fetch");
}

async function fetchData(city) {
  let cityDataUrl = new URL(
    `https://api.teleport.org/api/urban_areas/slug:${city}/scores/`
  );
  let response = await fetch(cityDataUrl);
  let cityData = response.json();
  if (response.status != 404) return cityData;
  else throw new Error("fetch");
}

function displayPhoto(photo) {
  const { image: photos } = photo.photos[0];
  background.style.backgroundImage = `url(${photos.web})`;
  background.style.padding = `1em`;
}

function displaycityData(cityData) {
  const { summary, categories, teleport_city_score: cityScore } = cityData;
  titleDisplay.textContent = userInput.value.toUpperCase();
  summaryDisplay.innerHTML = summary;
  categoriesDisplay.innerHTML = categories
    .map((category) => {
      return `<li class="city-data-categorie">${category.name}: ${Math.floor(
        category.score_out_of_10
      )}/10</li>`;
    })
    .join("");
  scoreDisplay.textContent = `Overall score ${cityScore.toFixed(2)}`;

// Set overall color
  let num = Number(`${cityScore.toFixed(2)}`);
  if (num > 59.99) {
    scoreDisplay.style.color = "green";
  } else {
    scoreDisplay.style.color = "red";
  }
}

//  Change CSS CityData
async function ChangeCityCss() {
  let dataSection = get("#city-data");
  let section = get("#search-section");
  background.style.backgroundColor = "#5a5a5a";
  background.style.borderBottom = "1px solid #5f6368";
  dataSection.style.border = "1px solid #5f6368";
  dataSection.style.boxShadow = "0 1px 6px 0 #171717";
  section.style.marginTop = "0";
}

userInput.addEventListener("input", autocompleteUserInput);
userInput.addEventListener("click", autocompleteUserInput);
document.addEventListener("click", () => (autocomplete.innerHTML = ""));
document.addEventListener("click", () => menu());
btn.addEventListener("click", reset);
formSearchBar.addEventListener("submit", onSubmit);
autocomplete.addEventListener("click", handleClickOnSuggestedCities);
