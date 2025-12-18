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
}

.pokemon-image {
  width: 200px;
  height: 200px;
}

.pokemon-name {
  margin-top: 10px;
  text-align: center;
}
</style>