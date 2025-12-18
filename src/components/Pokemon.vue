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
import { consumirAPIFacade } from '../clients/PokeApiClient';
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
      pokemonPool: [1, 2, 3, 4],
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
      this.attempts++;

      const selectedIds = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * this.pokemonPool.length);
        selectedIds.push(this.pokemonPool[randomIndex]);
      }

      try {
        const pokemonPromises = selectedIds.map(id => consumirAPIFacade(id));
        const pokemonData = await Promise.all(pokemonPromises);

        this.pokemons = pokemonData.map((data, index) => ({
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${selectedIds[index]}.svg`,
          name: data.name.toUpperCase(),
          id: selectedIds[index]
        }));

        this.calculateScore(selectedIds);

        this.checkGameEnd();
      } catch (error) {
        console.error('Error al obtener pokemon:', error);
      }
    },
    calculateScore(selectedIds) {
      const counts = {};
      selectedIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });

      const maxCount = Math.max(...Object.values(counts));

      if (maxCount === 3) {
        this.score += 5;
      } else if (maxCount === 2) {
        this.score += 2;
      }
    },
    checkGameEnd() {
      if (this.score >= 10) {
        this.gameOver = true;
        this.showMessage = true;
        this.messageType = 'won';
      }
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
}

h1 {
  margin-bottom: 20px;
}

.game-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.pokemon-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.play-button {
  padding: 10px 30px;
  cursor: pointer;
}

.play-button:disabled {
  cursor: not-allowed;
}
</style>