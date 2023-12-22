async function getWeather() {
    const city = document.getElementById('cityInput1').value;
    try {
        const response = await fetch(`https://forecast-api-service-tuurhulselmans.cloud.okteto.net/forecast_ordered/${city}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayWeatherData(data) {
    const labels = [];
    const highTemperatures = [];
    const lowTemperatures = [];

    data.forEach(forecast => {
        labels.push(forecast.date);
        highTemperatures.push(forecast.temperature_high);
        lowTemperatures.push(forecast.temperature_low);
    });

    const ctx = document.getElementById('weatherChart').getContext('2d');
    const weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'High Temp (°C)',
                data: highTemperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
                {
                    label: 'Low Temp (°C)',
                    data: lowTemperatures,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


async function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    let response; // Declare the response variable outside the try block

    try {
        response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();
        console.log('Access Token:', data.access_token);
        document.getElementById("loginMessage").innerHTML = "Login successful!";
        document.getElementById("loginMessage").classList.add("success");
    } catch (error) {
        console.error('There was a problem with the login operation:', error);
        document.getElementById("loginMessage").innerHTML = "Login failed. Please check your credentials.";
        document.getElementById("loginMessage").classList.add("error");
    }
}

async function createUser() {
    const email = document.getElementById('newEmailInput').value;
    const password = document.getElementById('newPasswordInput').value;
    let response; // Declare the response variable outside the try block

    try {
        response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('User creation failed.');
        }

        const data = await response.json();
        console.log('User created:', data);
        document.getElementById("createUserMessage").innerHTML = "User created successfully!";
        document.getElementById("createUserMessage").classList.add("success");
    } catch (error) {
        console.error('There was a problem with creating the user:', error);
        document.getElementById("createUserMessage").innerHTML = "Failed to create user. Please try again.";
        document.getElementById("createUserMessage").classList.add("error");
    }
}


async function addForecast() {
    const city = document.getElementById('cityInput').value;
    const date = document.getElementById('dateInput').value;
    const description = document.getElementById('descriptionInput').value;
    const high = parseFloat(document.getElementById('highInput').value);
    const low = parseFloat(document.getElementById('lowInput').value);
    const token = ''; // Provide the access token obtained after login
    let response; // Declare the response variable outside the try block

    try {
        response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/forecast/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ city, date, description, temperature_high: high, temperature_low: low })
        });

        if (!response.ok) {
            throw new Error('Adding forecast failed.');
        }

        const data = await response.json();
        console.log('Forecast added:', data);
        document.getElementById("addForecastMessage").innerHTML = "Forecast added successfully!";
        document.getElementById("addForecastMessage").classList.add("success");
    } catch (error) {
        console.error('There was a problem with adding the forecast:', error);
        document.getElementById("addForecastMessage").innerHTML = "Failed to add forecast. Please try again.";
        document.getElementById("addForecastMessage").classList.add("error");
    }
}

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = ''; // Clear previous data
    if (data.length === 0) {
        weatherDisplay.innerHTML = '<div class="message error">No forecast data found for this city.</div>';
        return;
    }

    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    data.forEach(forecast => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        const date = document.createElement('p');
        date.textContent = `Date: ${forecast.date}`;

        const description = document.createElement('p');
        description.textContent = `Description: ${forecast.description}`;

        const temperature = document.createElement('p');
        temperature.textContent = `Temperature: High ${forecast.temperature_high}°C, Low ${forecast.temperature_low}°C`;

        forecastCard.appendChild(date);
        forecastCard.appendChild(description);
        forecastCard.appendChild(temperature);

        forecastContainer.appendChild(forecastCard);
    });

    weatherDisplay.appendChild(forecastContainer);
}

