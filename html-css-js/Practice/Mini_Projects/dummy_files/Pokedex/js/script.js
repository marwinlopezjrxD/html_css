// Simple Pokémon data (expand this array as needed)
const pokemonList = [
  { name: '#001 Bulbasaur', type: 'Seed Pokémon', emoji: '🌱' },
  { name: '#004 Charmander', type: 'Lizard Pokémon', emoji: '🔥' },
  { name: '#007 Squirtle', type: 'Tiny Turtle Pokémon', emoji: '💧' }
];

// Get DOM elements
const scanBtn = document.getElementById('scan-btn');
const pokemonImg = document.getElementById('pokemon-img');
const pokemonName = document.getElementById('pokemon-name');
const pokemonType = document.getElementById('pokemon-type');
const screen = document.querySelector('.screen');

// Event listener for scan button
scanBtn.addEventListener('click', function() {
  // Pick random Pokémon
  const randomPoke = pokemonList[Math.floor(Math.random() * pokemonList.length)];
  
  // Update display
  pokemonImg.textContent = randomPoke.emoji;
  pokemonName.textContent = randomPoke.name;
  pokemonType.textContent = randomPoke.type;
  
  // Trigger glow animation
  screen.classList.add('glow');
  setTimeout(() => {
    screen.classList.remove('glow');
  }, 500); // Matches animation duration
});