const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
const OrbitControls = require('three-orbitcontrols');

import './style.css';

// setup scene
const scene = new THREE.Scene();
const bgd = 0x000d85;
const floorColor = 0x000d85;
const lightColor = 0xffffff;
scene.background = new THREE.Color(bgd);

const uiElements = document.querySelectorAll('.ui');

// setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const lights = [];
const cards = [];

// setup camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000,
);
camera.position.set(1, 2, -3);
scene.add(camera);

// setup controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.3;
controls.screenSpacePanning = true;
controls.target.set(0, 7, 0);

// setup ground
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: floorColor,
  metalness: 0.7,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);

// setup fog
const fogColor = bgd;
const fogNear = 25;
const fogFar = 60;
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

// load object
const loader = new GLTFLoader();
loader.load('./card/CreditCard_GLTF.gltf', function (gltf) {
  setupCards(gltf.scene);
  setupLights();

  uiElements.forEach((element) => {
    element.style.opacity = '';
  });
});

const setupCards = function (object) {
  const cardFront = object.clone();
  const cardBack = object.clone();
  scene.add(cardFront);
  scene.add(cardBack);

  const box = new THREE.Box3().setFromObject(cardFront);
  const size = box.getSize(new THREE.Vector3()).length() * 1.3;
  const center = box.getCenter(new THREE.Vector3());
  center.y = center.y * -200;

  cardFront.position.x += object.position.x - center.x;
  cardFront.position.y += object.position.y - center.y;
  cardFront.position.z += object.position.z - center.z;

  cardBack.position.x = -3;
  cardBack.position.y = 9;
  cardBack.position.z = -5;
  cardBack.rotation.z = 2.1;
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

  [cardFront, cardBack].forEach((object, index) =>
    object.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        if (index === 1) {
          node.receiveShadow = true;
        }
        if (node.material.map) node.material.map.anisotropy = 16;
      }
    }),
  );

  cards.push(cardFront, cardBack);
};

function setupLights() {
  const ambientLight = new THREE.AmbientLight(lightColor, 1.1);
  ambientLight.name = 'ambient_light';
  camera.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(lightColor, 1.8);
  directionalLight.position.set(10, 25, 5); // ~60º
  directionalLight.name = 'main_light';
  directionalLight.castShadow = true;
  window.directionalLight = directionalLight;
  camera.add(directionalLight);

  const d = 1000;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.bias = -0.01;
  directionalLight.shadow.radius = 5000;
  directionalLight.shadow.mapSize.width = 1024 * 2;
  directionalLight.shadow.mapSize.height = 1024 * 2;
  directionalLight.shadow.camera.far = 300;
  directionalLight.shadow.camera.near = 5;

  lights.push(ambientLight, directionalLight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();

  if (lights.length > 0) {
    // lights[1].position.set(
    // //   lights[1].position.x * 1.0001,
    // //   lights[1].position.y * 1.0001,
    // //   lights[1].position.z * 1.0001
    // );
  }
}
animate();

const themes = [
  {
    cardSrc: './themes/research-blue.jpg',
    name: 'Research - blue horizontal',
    thumbSrc: './thumbs/thumb_researchBlue.jpg',
    bg: '#000d85',
    floor: '#000d85',
  },
  {
    cardSrc: './themes/research-horiz-dark.jpg',
    name: 'Research - dark horizontal',
    thumbSrc: './thumbs/thumb_researchDark.jpg',
    bg: '#111',
    floor: '#111',
  },
  {
    cardSrc: './themes/sketch-blue.jpg',
    name: 'Sketchy - blue vertical',
    thumbSrc: './thumbs/thumb_researchDark.jpg',
    bg: '#000d85',
    floor: '#000d85',
  },
  {
    cardSrc: './card/CreditCard_GLTF_img3.jpg',
    name: 'Two-tone light purple',
    thumbSrc: './thumbs/thumb_twoToneLightPurple.jpg',
    bg: '#000d85',
    floor: '#000d85',
  },
  {
    cardSrc: './themes/card-dark.jpg',
    name: 'Two-tone dark mint',
    thumbSrc: './thumbs/thumb_twoToneDarkMint.jpg',
    bg: '#111111',
    floor: '#111111',
  },
  {
    cardSrc: './themes/gray-vertical.jpg',
    name: 'Grayscale Vertical',
    thumbSrc: './thumbs/thumb_grayscaleVertical.jpg',
    bg: '#111',
    floor: '#111',
  },
  {
    cardSrc: './themes/black-vertical.jpg',
    name: 'Black Vertical',
    thumbSrc: './thumbs/thumb_blackscaleVertical.jpg',
    bg: '#000',
    floor: '#050505',
  },
  {
    cardSrc: './themes/rising-blue.jpg',
    name: 'Rising Blue',
    thumbSrc: './thumbs/thumb_risingBlue.jpg',
    bg: '#000D85',
    floor: '#000D85',
  },
  {
    cardSrc: './themes/rising-black.jpg',
    name: 'Rising Black',
    thumbSrc: './thumbs/thumb_risingBlack.jpg',
    bg: '#000',
    floor: '#050505',
  },
  {
    cardSrc: './themes/mountain-orange.jpg',
    name: 'Mountain Orange',
    thumbSrc: './thumbs/thumb_mountainOrange.jpg',
    bg: '#111',
    floor: '#111',
  },
  {
    cardSrc: './themes/mountain-blue.jpg',
    name: 'Mountain Blue',
    thumbSrc: './thumbs/thumb_mountainBlue.jpg',
    bg: '#000D85',
    floor: '#000D85',
  },
];

let selectedTheme = 'light';

const themeContainer = document.querySelector('.js-theme-container');

const changeTexture = (themeName) => {
  cards.forEach((object, index) =>
    object.traverse((node) => {
      let hasChanged = false;
      if (node.isMesh && !hasChanged) {
        const texture = THREE.ImageUtils.loadTexture(themes[themeName].cardSrc);
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;
        node.material.map = texture;
        // sort of plastic
        // node.material.roughness = .28;
        // node.material.aoMap = null;
        // node.material.roughnessMap = null;
        // node.material.normalMap = null;
        hasChanged = true;
        node.material.needsUpdate = true;
      }
    }),
  );
};

const changeColors = (themeIndex) => {
  scene.background = new THREE.Color(themes[themeIndex].bg);
  plane.material.color.set(themes[themeIndex].floor);
  scene.fog = new THREE.Fog(themes[themeIndex].bg, fogNear, fogFar);
  document.body.style.color = themes[themeIndex].bg;
};

const setupThemeSelector = () => {
  themes.forEach((item, index) => {
    const button = document.createElement('button');
    button.classList.add(
      'theme-object',
      'rounded',
      'inline-block',
      'text-white',
      'relative',
      'flex',
      'justify-center',
      'align-center',
    );
    button.dataset.themeId = index;
    button.innerHTML = `<div class="w-7 h-7 overflow-hidden rounded">
          <img src="${item.thumbSrc}" />
        </div>
        <label class="block text-white text-xs absolute whitespace-nowrap">${item.name}</label>`;
    button.classList.remove('selected');
    button.addEventListener('click', () => {
      setSelectedTheme(index);
    });

    themeContainer.appendChild(button);
  });
};

const setSelectedTheme = (themeIndex) => {
  changeTexture(themeIndex);
  changeColors(themeIndex);
  selectedTheme = themeIndex;
  clearSelectedTheme();

  themes.forEach((_, index) => {
    if (index === themeIndex) {
      document
        .querySelector(`[data-theme-id="${index}"]`)
        .classList.add('selected');
    }
  });
};

const clearSelectedTheme = () => {
  const themeItems = document.querySelectorAll('[data-theme-id]');
  themeItems.forEach((item) => {
    item.classList.remove('selected');
  });
};

const toggleRotation = () => {
  controls.autoRotate = !controls.autoRotate;
  document.querySelector('.rotate-button').classList.toggle('selected');
};

setupThemeSelector();
toggleRotation();

window.addEventListener("load", () => {
  setTimeout(() => {
    setSelectedTheme(0);
  }, 100);
});

document
  .querySelector('.rotate-button')
  .addEventListener('click', toggleRotation);

window.changeTexture = changeTexture;
window.setTheme = setSelectedTheme;
