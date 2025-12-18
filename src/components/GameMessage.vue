<template>
  <div v-if="showMessage" class="game-message" :class="messageClass">
    <p class="message-line">{{ message1 }}</p>
    <p class="message-line">{{ message2 }}</p>
  </div>
</template>

<script>
export default {
  name: 'GameMessage',
  props: {
    showMessage: {
      type: Boolean,
      default: false
    },
    messageType: {
      type: String,
      default: '' 
    },
    score: {
      type: Number,
      default: 0
    }
  },
  computed: {
    message1() {
      if (this.messageType === 'lost') {
        return 'Ha utilizado tus 5 intentos';
      } else if (this.messageType === 'won') {
        return `Puntaje: ${this.score}`;
      }
      return '';
    },
    message2() {
      if (this.messageType === 'lost') {
        return 'El juego a terminado, inténtelo otra vez';
      } else if (this.messageType === 'won') {
        return 'Felicitaciones has ganado un premio de $10.000,00';
      }
      return '';
    },
    messageClass() {
      return {
        'message-lost': this.messageType === 'lost',
        'message-won': this.messageType === 'won'
      };
    }
  }
}
</script>

<style scoped>
.game-message {
  margin: 20px 0;
  padding: 20px;
  text-align: center;
  border: 2px solid #333;
  border-radius: 10px;
}

.message-line {
  margin: 5px 0;
  font-size: 20px;
  font-weight: bold;
}

.message-lost .message-line {
  color: red;
}

.message-won .message-line {
  color: blue;
}
</style>