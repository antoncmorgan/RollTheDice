<template>
  <button v-on:click="$emit(emitName)" :disabled="isDisabled" class="button" v-bind:class="getClass()">{{ buttonName }}</button>
</template>

<script>
export default {
  props: {
   buttonName: {
    type: String,
    required: false,
    default: 'Button'
   },
   hasEmphasis: {
     type: Boolean,
     required: false,
     default: false
   },
   isDisabled: {
     type: Boolean,
     required: false,
     default: false
   },
   emitName: {
     type: String,
     required: false,
     default: 'button-clicked'
   }
  },
  methods: {
    getClass() {
      return {
        'button-emphasis': this.hasEmphasis,
        'button-disabled': this.isDisabled
      }
    }
  }
}
</script>

<style scoped>
.button {
  display: block;
  min-width: 5em;
  min-height: 3em;
  padding: .2em;
  text-align: center;
  margin: .2em;

  font-family: Base-Light;
  font-size: 1.1em;
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
  border-radius: 0em;
  box-shadow: none;
  transition: all 0.5s cubic-bezier(.25,.8,.25,1);
}
.button:hover {
  box-shadow: none;
  color: #68E5FF;
	cursor: pointer;
}
.button:active {
  color: #FFFFFF;
	box-shadow: none;
}

.button-emphasis {
  color: #34BDD9;
  font-family: Base-Bold;
}
.button-emphasis:active {
  color: #34BDD9;
}
.button-disabled {
  opacity: .3;
  pointer-events: none;
}
</style>
