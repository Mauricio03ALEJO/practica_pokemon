<template>
  <div class="pokemon-card">
    <img :src="imageUrl" :alt="pokemonName" class="pokemon-image" />
    <p class="pokemon-name">{{ displayName }}</p>
  </div>
</template>

<script>
export default {
  name: "PokemonCard",
  props: {
    imageUrl: {
      type: String,
      default: "https://placehold.co/200x200/000000/000000.png",
    },
    pokemonName: {
      type: String,
      default: "XXXXXXXXXXX",
    },
  },
  computed: {
    displayName() {
      return this.pokemonName;
    },
  },
};
</script>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border: 2px solid #333;
  border-radius: 10px;
  background-color: #f0f0f0;
}

.pokemon-name {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>