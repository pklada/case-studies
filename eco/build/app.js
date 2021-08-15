"use strict";

var scene = new THREE.Scene();
var bgd = 0x000d85;
var floorColor = 0x000d85;
var lightColor = 0xa1b1f6;
scene.background = new THREE.Color(bgd);
var renderer = new THREE.WebGLRenderer();
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var lights = [];
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(1, 2, -3); //camera.lookAt(0, 1, 0);
// const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
// camera.add( pointLight );

scene.add(camera);
var loader = new THREE.GLTFLoader();
var resolvedObject;
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.screenSpacePanning = true;
controls.target.set(0, 7, 0);
var planeGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
var planeMaterial = new THREE.MeshStandardMaterial({
  color: floorColor
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);
var color = bgd;
var near = 25;
var far = 60;
scene.fog = new THREE.Fog(color, near, far);
loader.load("./build/card/CreditCard_GLTF.gltf", function (gltf) {
  setupObjects(gltf.scene);
});

var setupObjects = function setupObjects(object) {
  var cardFront = object.clone();
  var cardBack = object.clone();
  scene.add(cardFront);
  scene.add(cardBack);
  var box = new THREE.Box3().setFromObject(cardFront);
  var size = box.getSize(new THREE.Vector3()).length() * 1.3;
  var center = box.getCenter(new THREE.Vector3());
  center.y = center.y * -200;
  cardFront.position.x += object.position.x - center.x;
  cardFront.position.y += object.position.y - center.y;
  cardFront.position.z += object.position.z - center.z;
  cardBack.position.x = -5;
  cardBack.position.y = 10;
  cardBack.position.z = -5;
  cardBack.rotation.z = 2;
  cardBack.rotation.y = -0.5;
  window.cardBack = cardBack;
  cardFront.rotation.x = 0.4;
  cardFront.rotation.z = -0.4;
  camera.near = size / 100;
  camera.far = size * 1000;
  camera.position.copy(center);
  camera.position.x += size;
  camera.position.y += size * 1.3;
  camera.position.z += size;
  camera.updateProjectionMatrix();
  [cardFront, cardBack].forEach(function (object, index) {
    return object.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;

        if (index === 1) {
          node.receiveShadow = true;
        }

        if (node.material.map) node.material.map.anisotropy = 16;
      }
    });
  });
  resolvedObject = object;
  addLights();
};

function addLights() {
  var light1 = new THREE.AmbientLight(lightColor, 2);
  light1.name = "ambient_light";
  window.light1 = light1;
  camera.add(light1);
  var light2 = new THREE.DirectionalLight(lightColor, 1.6);
  light2.position.set(0.5, 20, 0.866); // ~60º

  light2.name = "main_light";
  light2.castShadow = true;
  window.light2 = light2;
  camera.add(light2);
  var d = 1200;
  light2.shadow.camera.left = -d;
  light2.shadow.camera.right = d;
  light2.shadow.camera.top = d;
  light2.shadow.camera.bottom = -d;
  light2.shadow.radius = 500;
  light2.shadow.bias = -0.01;
  light2.shadow.mapSize.width = 1024 * 4;
  light2.shadow.mapSize.height = 1024 * 4;
  lights.push(light1, light2);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();

  if (lights[1]) {
    lights[1].position.set(camera.position.x + 10, camera.position.y + 10, camera.position.z + 10);
  }
}

animate();