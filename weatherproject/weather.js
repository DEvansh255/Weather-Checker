let temperatureChart; // Declare the Chart.js instance globally

        async function getWeather() {
            const city = document.getElementById("city").value.trim();
            const apiKey = "86c141b4542b425abb6164842252401"; // Replace with your WeatherAPI key

            if (!city) {
                alert("Please enter a city name.");
                return;
            }

            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4&aqi=no`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("City not found. Please check the name.");
                }

                const data = await response.json();
                displayWeather(data);
                displayForecast(data.forecast.forecastday);
                showTemperatureGraph(data.forecast.forecastday);
            } catch (error) {
                alert(error.message);
            }
        }

        function displayWeather(data) {
            const weatherDiv = document.getElementById("weather");

            const condition = data.current.condition.text.toLowerCase();
            const tempC = data.current.temp_c;

            weatherDiv.innerHTML = `
                <img src="https:${data.current.condition.icon}" alt="Weather Icon">
                <p><strong>City:</strong> ${data.location.name}, ${data.location.country}</p>
                <p><strong>Temperature:</strong> ${tempC} °C</p>
                <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                <p><strong>Wind:</strong> ${data.current.wind_kph} km/h</p>
            `;

            updateBackground(condition);
        }

        function displayForecast(forecastDays) {
            const forecastDiv = document.getElementById("forecast");
            forecastDiv.innerHTML = ""; // Clear previous forecast cards

            forecastDays.forEach(day => {
                const forecastCard = document.createElement("div");
                forecastCard.className = "forecast-card";

                forecastCard.innerHTML = `
                    <p><strong>${new Date(day.date).toDateString()}</strong></p>
                    <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                    <p><strong>${day.day.avgtemp_c} °C</strong></p>
                    <p>${day.day.condition.text}</p>
                `;

                forecastDiv.appendChild(forecastCard);
            });
        }

        function showTemperatureGraph(forecastDays) {
            const ctx = document.getElementById("temperatureChart").getContext("2d");

            // Extract temperature and labels for the graph
            const labels = forecastDays.map(day => new Date(day.date).toDateString());
            const temperatures = forecastDays.map(day => day.day.avgtemp_c);

            if (temperatureChart) {
                // Update the existing chart
                temperatureChart.data.labels = labels;
                temperatureChart.data.datasets[0].data = temperatures;
                temperatureChart.update();
            } else {
                // Create a new chart
                temperatureChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Average Temperature (°C)",
                                data: temperatures,
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 2,
                                fill: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: false,
                            },
                        },
                    },
                });
            }
        }

        function updateBackground(condition) {
            if (condition.includes("clear")) {
                document.body.style.background = "linear-gradient(to bottom, #87ceeb, #ffffff)";
            } else if (condition.includes("rain")) {
                document.body.style.background = "linear-gradient(to bottom, #4e73df, #282c34)";
            } else if (condition.includes("cloud")) {
                document.body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
            } else if (condition.includes("mist")) {
                document.body.style.background = "linear-gradient(to bottom, #bfc1c2, #d3d4d5)";
            }
        }