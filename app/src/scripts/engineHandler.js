
import * as BABYLON from '@babylonjs/core';

export default {
  gameIndex: null,
  gameUID: null,
  previewIndex: null,
  previewView: null,
  gameView: null,
  scenes: [],
  gameInit(scene) {
    scene.appHandler = {};
  },
  updateRenderLoop() {
    let _self = this;
    this.engine.runRenderLoop(function() {
      if (_self.gameView && (_self.engine.activeView.target === _self.gameView.target)) {
        _self.scenes[_self.gameIndex].render();
      }
      else if (_self.previewView && (_self.engine.activeView.target === _self.previewView.target)) {
        _self.scenes[_self.previewIndex].render();
      }
    });
  },
  startGameEngine(progressUpdater, onAssetLoaderComplete) {
    let _self = this;
    let canvas = document.getElementById('renderCanvas');
    
    if (!this.engine) {
      this.engine = new BABYLON.Engine(document.createElement("canvas"), true);
      this.updateRenderLoop();
    }
    
    this.scenes.forEach(scene => {
      scene.detachControl();
    });

    let scene = this.createScene(this.engine, canvas, this.gameInit);
    
    let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 3, 1.2, 30, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, false);
    camera.inertia = .1;
    camera.panningInertia = .1;
    camera.angularSensibilityX = 400;
    camera.angularSensibilityY = 400;
    camera.inputs.attached.pointers.buttons[0] = 1;
    camera.panningSensibility = 50;
    camera.wheelPrecision = 5;
    camera.inputs.attached.keyboard.angularSpeed = 0.05;
    camera.inputs.attached.keyboard.panningSensibility = 2;
    camera.inputs.attached.keyboard.zoomingSensibility = .75;
    
    this.gameView = this.engine.registerView(canvas, camera, true);

    this.engine.inputElement = canvas;
    scene.attachControl();

    scene.camera = camera;

    this.engine.renderEvenInBackground = false;

    scene.assetsManager = new BABYLON.AssetsManager(scene);
    scene.assetsManager.useDefaultLoadingScreen = false;

    scene.assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
      progressUpdater(remainingCount, totalCount, lastFinishedTask);
    };

    scene.assetsManager.onFinish = function(tasks) {
      onAssetLoaderComplete(tasks);
    }
    
    this.gameIndex = this.scenes.push(scene) - 1;
    this.gameUID = scene.uid;

    window.addEventListener('resize', function() {
      _self.engine.resize();
    });
  },
  clearAll() {
    if (this.engine) {
      this.engine.stopRenderLoop();
      this.engine.dispose();
      this.engine = null;
      this.scenes = [];
    }
  },
  stopPreviewView() {
    this.scenes[this.previewIndex].detachControl();
    this.scenes[this.previewIndex].dispose();
    this.scenes.splice(this.previewIndex, 1);
    this.engine.unRegisterView(document.getElementById('modelUploadCanvas'));
    this.previewView = null;
    this.previewIndex = null;
  },
  restartGameEngine() {
    let _self = this;
    this.scenes.forEach((scene, index) => {
      if (scene.uid == _self.gameUID) {
        _self.gameIndex = index;
      }
    });
    
    this.engine.inputElement = document.getElementById('renderCanvas');
    this.scenes[this.gameIndex].attachControl();
  },
  stopGameEngine() {
    if (this.engine) {
      this.engine.stopRenderLoop();
      if (this.scenes[this.gameIndex]) {
        this.scenes[this.gameIndex].dispose();
        this.scenes.splice(this.gameIndex, 1);
      }
      this.engine.dispose();
      this.engine = null;
    }
  },
  pauseEngineRender() {
    this.engine.stopRenderLoop();
  },
  getScale() {
    this.viewportScale = undefined;
    // Calculate viewport scale 
    this.viewportScale = screen.width / window.innerWidth;
    return this.viewportScale;
  },
  createScene(engine, canvas, appInit) {
    let _self = this;
    let scene = new BABYLON.Scene(engine);
    scene.isEditMode = false;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(-20, 20, -20), scene);
    scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .95);
    scene.ambientLight.specular = new BABYLON.Color3(.2, .2, .2);
    scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
    scene.ambientLight.intensity = 1;
    
    scene.light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 100, 0), scene);
    scene.light.diffuse = new BABYLON.Color3(.18, .15, .15);
    scene.light.specular = new BABYLON.Color3(0, 0, 0);

    // Create a flat table surface
    scene.ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 40, height: 40}, scene);

    // Create a 6-sided die
    scene.die6 = BABYLON.MeshBuilder.CreateBox("die6", {size: 1}, scene);

    // Create a physics engine
    var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.ground.physicsImpostor = new BABYLON.PhysicsImpostor(scene.ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.5, restitution: 0.7}, scene);

    // Randomize the starting positions and rotations of the dice
    scene.die6.position = new BABYLON.Vector3(0, 5, 0);
    scene.die6.rotation = new BABYLON.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.checkIsDieRolling = false;

    scene.registerBeforeRender(function () {
      if (scene.checkIsDieRolling) {
        if (scene.die6.physicsImpostor?.getLinearVelocity().length() < 0.1) {
          console.log("The die has stopped moving.");
          scene.checkIsDieRolling = false;
          scene.appHandler.getDieValue(scene.die6, 6);
        }
      }
    });

    appInit(scene);

    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:
              break;
          case BABYLON.PointerEventTypes.POINTERUP:
              break;
          case BABYLON.PointerEventTypes.POINTERMOVE:
              break;
          case BABYLON.PointerEventTypes.POINTERWHEEL:
              break;
          case BABYLON.PointerEventTypes.POINTERPICK:
              break;
          case BABYLON.PointerEventTypes.POINTERTAP:
              break;
          case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
              break;
      }
    });

    return scene;
  }
}
