var camera, scene, renderer, geometry, material, mesh, controls, trackball;

var Menu = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.displayOutline = false;
}

window.onload = function() {
  var text = new Menu();
  var gui = new DAT.GUI();
  gui.add(text, 'message');
  gui.add(text, 'speed', -5, 5);
  gui.add(text, 'displayOutline');
  gui.add(text, 'explode');
};

init();
animate();

function init() {
    createScene();
	createCamera();
	createTrackball();
	createCube();
	addedCubeAndCameraToScene();
	createRenderer();
	addedHuman();
	addedRenderer();
	createOrbitControls();
}

	function createScene() {
		scene = new THREE.Scene();
	}

	function createCamera() {
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 500;
	}

	function createTrackball() {
		trackball = new THREE.TrackballControls(camera);
		trackball.rotateSpeed = 1.0;
		trackball.zoomSpeed = 1.2;
		trackball.panSpeed = 0.8;
		trackball.noZoom = false;
		trackball.noPan = false;
		trackball.staticMoving = true;
		trackball.dynamicDampingFactor = 0.3;
		trackball.keys = [ 65, 83, 68 ];
		trackball.addEventListener('change', render);
	}

	function createCube() {
		geometry = new THREE.CubeGeometry(100, 100, 100);
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh(geometry, material);
	}

	function addedCubeAndCameraToScene() {
		scene.add(camera);
		scene.add(mesh);
	}

	function createRenderer() {
		renderer = new THREE.CanvasRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function addedHuman() {
		var loader = new THREE.JSONLoader();
		loader.load( 'model/model.json', function (geometry, materials) {
			createHuman(geometry, materials);
		}); 
	}
	
		function createSkinnedMesh(geometry, materials) { 
		  skinnedMesh = new THREE.SkinnedMesh(geometry, 
			  new THREE.MeshFaceMaterial(materials)); 
		  enableSkinning(skinnedMesh); 
		}
		
		function enableSkinning(skinnedMesh) { 
		   var materials = skinnedMesh.material.materials; 
		   for (var i = 0,length = materials.length; i < length; i++) { 
			   var mat = materials[i]; 
			   mat.skinning = true; 
		   } 
		}
	
		function createHuman(geometry, materials) {
			materials[0].shading = THREE.SmoothShading;
			var material = loadMaterial(materials);
			var human = getHumanMesh(geometry, material);
			scene.add(human);
		}
		
			function loadMaterial(materials) {
				return new THREE.MeshFaceMaterial({ map: materials });
			}
			
				function loadTexture() {
					var textureLoader = new THREE.TextureLoader();
					var texture;
					return textureLoader.load('model/young_lightskinned_male_diffuse.png', function(tex) {
						return new THREE.MeshBasicMaterial({ map: tex });
					});
				}
			
			function getHumanMesh(geometry, materials) {
				var human = new THREE.Mesh(geometry, material);
				return setHumanPosition(human, 0, -50, 200);
			}
			
				function setHumanPosition(human, x, y, z) {
					human.position.x = x;
					human.position.y = y;
					human.position.z = z;
					return human;
				}

	function addedRenderer() {
		document.body.appendChild(renderer.domElement);
		renderer.render(scene, camera);
	}

	function createOrbitControls() {
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
	}

function animate() {
    requestAnimationFrame(animate);
    render();
}

	function render() {
		//meshRotation(0.01, 0.02);
		controls.update();   
		renderer.render(scene, camera);
	}
	
		function meshRotation(x, y) {
			mesh.rotation.x += x;
			mesh.rotation.y += y;
		}