/**
 * Random Joke Generator
 * Fetches jokes from an external API and displays them
 */

// Using the Official Joke API (https://official-joke-api.appspot.com)
const JOKE_API_BASE = 'https://official-joke-api.appspot.com/random_joke';

/**
 * Fetches a random joke from the API
 * @returns {Promise<Object>} Joke object with setup and punchline
 */
async function getRandomJoke() {
  try {
    const response = await fetch(JOKE_API_BASE);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const joke = await response.json();
    return joke;
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw error;
  }
}

/**
 * Displays a joke in a formatted way
 * @param {Object} joke - Joke object containing setup and punchline
 */
function displayJoke(joke) {
  console.log('\n' + '='.repeat(50));
  console.log('📝 RANDOM JOKE');
  console.log('='.repeat(50));
  console.log(`\n🎤 Setup: ${joke.setup}`);
  console.log(`\n😄 Punchline: ${joke.punchline}`);
  console.log(`\nType: ${joke.type}`);
  console.log('='.repeat(50) + '\n');
}

/**
 * Main function to get and display a random joke
 */
async function main() {
  try {
    console.log('Fetching a random joke for you...\n');
    const joke = await getRandomJoke();
    displayJoke(joke);
  } catch (error) {
    console.error('Failed to get a joke:', error.message);
  }
}

// Run the joke generator
main();