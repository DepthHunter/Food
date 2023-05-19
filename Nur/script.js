const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const loadingMessage = document.getElementById('loading-message');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

prevBtn.addEventListener('click', () => paginate(-1));
nextBtn.addEventListener('click', () => paginate(1));

const allMeals = [];

searchBtn.addEventListener('click', () => getMealList());
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

let filteredMeals = [];
let isSearching = false;

async function fetchAllMeals() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    return data.meals;
}

async function populateMealList() {
    const meals = await fetchAllMeals();
    Array.prototype.push.apply(allMeals, meals);
    renderMealList(currentPage);
}


populateMealList();

function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();

    filteredMeals = allMeals.filter(meal => {
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient && ingredient.toLowerCase().includes(searchInputTxt.toLowerCase())) {
                return true;
            }
        }
        return false;
    });

    const titleElement = document.querySelector('.title');

    if (searchInputTxt && filteredMeals.length > 0) {
        titleElement.classList.remove('hidden');
    } else {
        titleElement.classList.add('hidden');
    }

    isSearching = true;
    currentPage = 1;
    renderFilteredMeals(currentPage);
}


function renderFilteredMeals(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const mealsToRender = filteredMeals.slice(startIndex, endIndex);

    let html = "";

    if (mealsToRender.length) {
        mealsToRender.forEach(meal => {
            html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
        });
    } else {
        html = "Sorry, we didn't find any meal!";
    }

    mealList.innerHTML = html;

    updatePaginationButtonsForFilteredMeals();
}



let currentPage = 1;
const itemsPerPage = 6;

function paginate(direction) {
    currentPage += direction;

    if (isSearching) {
        renderFilteredMeals(currentPage);
    } else {
        renderMealList(currentPage);
    }

    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage * itemsPerPage > allMeals.length) {
        currentPage = Math.ceil(allMeals.length / itemsPerPage);
    }

}


function renderMealList(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const mealsToRender = allMeals.slice(startIndex, endIndex);

    let html = "";

    if (mealsToRender.length) {
        mealsToRender.forEach(meal => {
            html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
        });
    } else {
        html = "Sorry, we didn't find any meal!";
    }

    mealList.innerHTML = html;

    updatePaginationButtons();
}

function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * itemsPerPage >= allMeals.length;
    pageInfo.textContent = `Page ${currentPage}/${Math.ceil(allMeals.length / itemsPerPage)}`;
}


async function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.parentElement.parentElement;

        loadingMessage.style.display = 'block'; // Show the loading message
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
        const data = await response.json();
        loadingMessage.style.display = 'none'; // Hide the loading message
        mealRecipeModal(data.meals);
    }
}

function updatePaginationButtonsForFilteredMeals() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * itemsPerPage >= filteredMeals.length;
    pageInfo.textContent = `Page ${currentPage}/${Math.ceil(filteredMeals.length / itemsPerPage)}`;
}

function mealRecipeModal(meal) {
    meal = meal[0];
    const html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
