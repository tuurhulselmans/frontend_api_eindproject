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
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = ''; // Clear previous data
    if (data.length === 0) {
        weatherDisplay.innerHTML = 'No forecast data found for this city.';
        return;
    }
    const ul = document.createElement('ul');
    data.forEach(forecast => {
        const li = document.createElement('li');
        li.textContent = `Date: ${forecast.date}, Description: ${forecast.description}, High: ${forecast.temperature_high}, Low: ${forecast.temperature_low}`;
        ul.appendChild(li);
    });
    weatherDisplay.appendChild(ul);
}

async function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    try {
        const response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/token', {
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
        // Store token or handle authenticated state
        console.log('Access Token:', data.access_token);
    } catch (error) {
        console.error('There was a problem with the login operation:', error);
    }
}

async function createUser() {
    const email = document.getElementById('newEmailInput').value;
    const password = document.getElementById('newPasswordInput').value;
    try {
        const response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/users/', {
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
    } catch (error) {
        console.error('There was a problem with creating the user:', error);
    }
}

async function addForecast() {
    const city = document.getElementById('cityInput').value;
    const date = document.getElementById('dateInput').value;
    const description = document.getElementById('descriptionInput').value;
    const high = parseFloat(document.getElementById('highInput').value);
    const low = parseFloat(document.getElementById('lowInput').value);
    const token = ''; // Provide the access token obtained after login

    try {
        const response = await fetch('https://forecast-api-service-tuurhulselmans.cloud.okteto.net/forecast/', {
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
    } catch (error) {
        console.error('There was a problem with adding the forecast:', error);
    }
}
