<template>
  <div class="main-container">
		<canvas id="renderCanvas"></canvas>
    <ButtonText 
      class="button-roll"
      v-bind:buttonName="'Roll The Dice'"
      @button-clicked="rollDice()"/>
    <h2>{{ dieRollValue > 0 ? dieRollValue : "Click Roll" }}</h2>
  </div>
</template>

<script>
import * as BABYLON from '@babylonjs/core';
import * as Cannon from 'cannon';
import Engine from "../scripts/engineHandler.js"

import ButtonText from "../components/base/button-text.vue"

export default {
  components: {
    ButtonText
  },
  data () {
    return {
      dieRollValue: 0
    }
  },
  created() {
    window.CANNON = Cannon;
  },
  mounted() {
    Engine.clearAll();
    this.loadEngine();
  },
  methods: {
    
		loadEngine() {
			console.log("Loading engine");
			Engine.stopGameEngine();
			Engine.startGameEngine(this.progressUpdater, this.onAssetLoaderComplete);
			Engine.scenes[Engine.gameIndex].assetsManager.load();
      Engine.scenes[Engine.gameIndex].appHandler.getDieValue = this.getDieValue;
		},
    progressUpdater() {

    },
    onAssetLoaderComplete() {

    },
    rollDice() {
      console.log("Let it Roll");
      let scene = Engine.scenes[Engine.gameIndex]
      
      // Enable physics for the dice
      if (scene.die6.physicsImpostor) {
        // scene.die6.physicsImpostor.resetForces();
        scene.die6.physicsImpostor.applyImpulse(
          scene.die6.previousImpulse.negate(),
          scene.die6.getAbsolutePosition()
        );
        scene.die6.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        scene.die6.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        scene.die6.position = new BABYLON.Vector3(0, 5, 0);
      }
      else {
        scene.die6.physicsImpostor = new BABYLON.PhysicsImpostor(scene.die6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, friction: 0.5, restitution: 0.7}, scene);
      }

      // Apply random forces to the dice to simulate rolling
      scene.die6.previousImpulse = new BABYLON.Vector3(Math.random() * 10 - 5, Math.random() * 2, Math.random() * 10 - 5);
      scene.die6.physicsImpostor.applyImpulse(
        scene.die6.previousImpulse,
        scene.die6.getAbsolutePosition()
      );
      scene.checkIsDieRolling = true;
    },
    getDieValue(die, sides) {
      this.dieRollValue = this.calculateDieValue(die, sides);
    },
    calculateDieValue(die, sides) {
      // Get the die's current rotation
      var rotation = die.rotation;

      // Calculate the x, y, and z components of the die's rotation
      var x = Math.round(rotation.x / (Math.PI / 2)) * (Math.PI / 2);
      var y = Math.round(rotation.y / (Math.PI / 2)) * (Math.PI / 2);
      var z = Math.round(rotation.z / (Math.PI / 2)) * (Math.PI / 2);

      // Check which side of the die is facing up based on the rotation
      // var value = (sides / 2 + (sides / 2 * x / Math.PI) + (sides / 4 * y / Math.PI) + (z / Math.PI)) % sides + 1;
      if (x === 0 && y === 0 && z === 0) return 1;
      else if (x === 0 && y === 0 && z === Math.PI / 2) return 2;
      else if (x === 0 && y === 0 && z === Math.PI) return 3;
      else if (x === 0 && y === 0 && z === (3 * Math.PI) / 2) return 4;
      else if (x === Math.PI / 2 && y === 0 && z === 0) return 5;
      else if (x === (3 * Math.PI) / 2 && y === 0 && z === 0) return 6;

      // return value;
    }
  }
}
</script>

<style scoped>

#renderCanvas {
	position: absolute;
	left: 0em;
	top: 0em;
	width: 100%;
	height: 100%;
	touch-action: none;
}

.button-roll {
  position: relative;
  z-index: 10
}

</style>

