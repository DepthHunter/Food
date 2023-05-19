const preferenceForm = document.getElementById('preference-form');
preferenceForm.addEventListener('submit', getMealRecommendations);

async function getMealRecommendations(event) {
    console.log('getMealRecommendations');
    event.preventDefault();

    const dietaryPreferences = document.getElementById('dietary-preferences').value;

    const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dietaryPreferences: dietaryPreferences
        })
    });

    const data = await response.json();

    console.log(data);

    // Here is where we modify the DOM to display the results
    const mealList = document.getElementById('meal');

    let html = '';
    const meals = data.suggestion.split('\n'); // This will split the suggestion string into an array of meal names

    meals.forEach((meal, index) => {
        html += `
            <div class="meal-item" data-id="${index}">
                <div class="meal-img">
                    <img src="https://via.placeholder.com/150" alt="food">
                </div>
                <div class="meal-name">
                    <h3>${meal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
            </div>
        `;
    });

    mealList.innerHTML = html;
}
