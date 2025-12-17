<template>
  <div class="pokemon-game">
    <h1>Juego POKEMON</h1>
    
    <div class="game-info">
      <p><strong>Intentos:</strong> {{ attempts }} / 5</p>
      <p><strong>Puntos:</strong> {{ score }}</p>
    </div>

    <div class="pokemon-cards">
      <PokemonCard 
        v-for="(pokemon, index) in pokemons" 
        :key="index"
        :imageUrl="pokemon.imageUrl"
        :pokemonName="pokemon.name"
      />
    </div>

    <button 
      @click="jugar" 
      class="play-button"
      :disabled="gameOver"
    >
      JUGAR
    </button>

    <GameMessage 
      :showMessage="showMessage"
      :messageType="messageType"
      :score="score"
    />
  </div>
</template>

<script>
import { consumirAPIFacade } from '../clients/PokeApiClients';
import PokemonCard from './PokemonCard.vue';
import GameMessage from './GameMessage.vue';

export default {
  name: 'Pokemon',
  components: {
    PokemonCard,
    GameMessage
  },
  data() {
    return {
      pokemons: [
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null },
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null },
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null }
      ],
      pokemonPool: [1, 2, 3, 4], // Pool fijo de 4 pokemon
      attempts: 0,
      score: 0,
      gameOver: false,
      showMessage: false,
      messageType: ''
    }
  },
  methods: {
    async jugar() {
      if (this.attempts >= 5 || this.gameOver) {
        return;
      }

      // Incrementar intentos
      this.attempts++;

      // Seleccionar 3 pokemon aleatorios del pool
      const selectedIds = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * this.pokemonPool.length);
        selectedIds.push(this.pokemonPool[randomIndex]);
      }

      // Obtener datos de los pokemon
      try {
        const pokemonPromises = selectedIds.map(id => consumirAPIFacade(id));
        const pokemonData = await Promise.all(pokemonPromises);

        // Actualizar las cartas
        this.pokemons = pokemonData.map((data, index) => ({
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${selectedIds[index]}.svg`,
          name: data.name.toUpperCase(),
          id: selectedIds[index]
        }));

        // Calcular puntos
        this.calculateScore(selectedIds);

        // Verificar condiciones de fin de juego
        this.checkGameEnd();
      } catch (error) {
        console.error('Error al obtener pokemon:', error);
      }
    },
    calculateScore(selectedIds) {
      // Contar coincidencias
      const counts = {};
      selectedIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });

      const maxCount = Math.max(...Object.values(counts));

      if (maxCount === 3) {
        // 3 pokemon iguales
        this.score += 5;
      } else if (maxCount === 2) {
        // 2 pokemon iguales
        this.score += 2;
      }
      // Si maxCount === 1, no coincide ninguno, se suma 0
    },
    checkGameEnd() {
      // Verificar si ganó (10 o más puntos)
      if (this.score >= 10) {
        this.gameOver = true;
        this.showMessage = true;
        this.messageType = 'won';
      }
      // Verificar si perdió (5 intentos sin llegar a 10 puntos)
      else if (this.attempts >= 5) {
        this.gameOver = true;
        this.showMessage = true;
        this.messageType = 'lost';
      }
    },
    resetGame() {
      this.pokemons = [
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null },
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null },
        { imageUrl: 'https://placehold.co/200x200/000000/000000.png', name: 'XXXXXXXXXXX', id: null }
      ];
      this.attempts = 0;
      this.score = 0;
      this.gameOver = false;
      this.showMessage = false;
      this.messageType = '';
    }
  }
}
</script>

<style scoped>
.pokemon-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #ffcb05;
  text-shadow: 2px 2px 4px #3d7dca;
  margin-bottom: 20px;
}

.game-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  font-size: 18px;
}

.pokemon-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.play-button {
  padding: 15px 40px;
  font-size: 20px;
  font-weight: bold;
  background-color: #3d7dca;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.play-button:hover:not(:disabled) {
  background-color: #2c5fa0;
}

.play-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>