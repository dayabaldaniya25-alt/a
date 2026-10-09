/**
 * Weather Dashboard
 * Fetches real-time weather data from OpenWeatherMap API
 * Displays current weather, forecast, and detailed conditions
 */

// Using OpenWeatherMap API (free tier)
// Sign up for free API key at: https://openweathermap.org/api
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';

/**
 * Fetches current weather for a given city
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data object
 */
async function getCurrentWeather(city) {
  try {
    const url = `${WEATHER_API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found`);
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    throw error;
  }
}

/**
 * Fetches 5-day weather forecast for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data object
 */
async function getWeatherForecast(city) {
  try {
    const url = `${WEATHER_API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    throw error;
  }
}

/**
 * Formats temperature with appropriate emoji
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Formatted temperature with emoji
 */
function formatTemperature(temp) {
  if (temp < 0) return `❄️  ${temp}°C (Freezing)`;
  if (temp < 10) return `🥶 ${temp}°C (Cold)`;
  if (temp < 20) return `🧥 ${temp}°C (Cool)`;
  if (temp < 30) return `😊 ${temp}°C (Comfortable)`;
  if (temp < 40) return `☀️  ${temp}°C (Hot)`;
  return `🔥 ${temp}°C (Very Hot)`;
}

/**
 * Gets weather emoji based on condition
 * @param {string} condition - Weather condition
 * @returns {string} Appropriate emoji
 */
function getWeatherEmoji(condition) {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('cloud')) return '☁️ ';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️ ';
  if (conditionLower.includes('rain')) return '🌧️ ';
  if (conditionLower.includes('snow')) return '❄️ ';
  if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️ ';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️ ';
  if (conditionLower.includes('wind')) return '💨 ';
  return '🌍 ';
}

/**
 * Displays current weather in formatted layout
 * @param {Object} data - Current weather data
 */
function displayCurrentWeather(data) {
  const { name, sys, main, weather, wind, clouds, visibility } = data;
  const emoji = getWeatherEmoji(weather[0].main);
  
  console.log('\n' + '='.repeat(60));
  console.log(`📍 CURRENT WEATHER - ${name}, ${sys.country}`);
  console.log('='.repeat(60));
  
  console.log(`\n${emoji} Condition: ${weather[0].main} (${weather[0].description})`);
  console.log(`${formatTemperature(main.temp)}`);
  console.log(`🌡️  Feels like: ${main.feels_like}°C`);
  console.log(`💧 Humidity: ${main.humidity}%`);
  console.log(`🌪️  Wind Speed: ${wind.speed} m/s`);
  console.log(`👁️  Visibility: ${(visibility / 1000).toFixed(2)} km`);
  console.log(`☁️  Cloud Coverage: ${clouds.all}%`);
  console.log(`🔽 Pressure: ${main.pressure} hPa`);
  
  if (main.temp_max && main.temp_min) {
    console.log(`📊 Temp Range: ${main.temp_min}°C to ${main.temp_max}°C`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Displays weather forecast for next 5 days
 * @param {Object} data - Forecast data
 */
function displayForecast(data) {
  const { list } = data;
  
  console.log('📅 5-DAY FORECAST (Next 24-40 hours)');
  console.log('='.repeat(60));
  
  // Display every 8th forecast (8 forecasts per day, so this shows daily)
  for (let i = 0; i < Math.min(list.length, 40); i += 8) {
    const forecast = list[i];
    const date = new Date(forecast.dt * 1000);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit'
    });
    
    const emoji = getWeatherEmoji(forecast.weather[0].main);
    console.log(`\n${emoji} ${dateStr}`);
    console.log(`   Temp: ${forecast.main.temp}°C | ${forecast.weather[0].main}`);
    console.log(`   Humidity: ${forecast.main.humidity}% | Wind: ${forecast.wind.speed} m/s`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Main weather dashboard function
 * @param {string} city - City to fetch weather for
 */
async function displayWeatherDashboard(city) {
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('⚠️  Error: OpenWeatherMap API key not set!');
    console.log('Please set your API key:');
    console.log('1. Sign up at https://openweathermap.org/api');
    console.log('2. Set environment variable: export OPENWEATHER_API_KEY=your_key');
    process.exit(1);
  }
  
  try {
    console.log(`\n🌤️  Loading weather data for ${city}...\n`);
    
    const currentWeather = await getCurrentWeather(city);
    displayCurrentWeather(currentWeather);
    
    const forecast = await getWeatherForecast(city);
    displayForecast(forecast);
    
    console.log('✅ Weather dashboard updated successfully!\n');
  } catch (error) {
    console.error(`❌ Failed to display weather dashboard: ${error.message}\n`);
  }
}

// Main execution - Default city: London
const city = process.argv[2] || 'London';
displayWeatherDashboard(city);