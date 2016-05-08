var camera, scene, renderer, geometry, material, mesh, controls, trackball;

var textures = [
	"model/classicshoes_texture_normals.png",
	"model/eyebrow001.png",
	"model/eyelashes01.png",
	"model/jeans01_black_diffuse.png",
	"model/jeans01_normals.png",
	"model/male02_diffuse_black.png",
	"model/tongue01_diffuse.png",
	"model/tshirt02_normals.png",
	"model/tshirt02_texture.png",
	"model/young_lightskinned_male_diffuse.png",
	"model/brown_eye.png",
	"model/classicshoes_texture_diffuse_black.png"
];

var LocationFiles = {
	model: "model/",
	textures: "img/textures"
};

	function getModel(name) {
		return LocationFiles.model + name;
	}

	function getTexture(name) {
		return LocationFiles.textures + name;
	}
	
var Menu = function() {
  this.message = 'dat.gui';
}

window.onload = function() {
  var text = new Menu();
  var gui = new DAT.GUI();
  gui.add(text, 'message');
};

init();
animate();

function init() {
    createScene();
	createCamera();
	createTrackball();
	
	var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
	scene.add(hemi);
	
	createCube();
	addedCubeAndCameraToScene();
	createRenderer();
	createLight();
	addedHuman();
	addedRenderer();
	createOrbitControls();
}

	function createScene() {
		scene = new THREE.Scene();
	}

	function createCamera() {
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(50, 50, 400);
		camera.lookAt(scene.position);
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
		renderer.setClearColor(0xdddddd);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapSoft = true;
	}
	
	function createLight() {
        var light = new THREE.PointLight( 0xFFFFFF );
        light.position.set( 0, 10, 200 );
        scene.add( light );
	}

	function addedHuman() {
		var texts;
		loadTextures(function (result) {
			texts = result;
			
			var loader = new THREE.JSONLoader();
			loader.load(getModel('model.json'), function (geometry, materials) {
				for(var i=0; i<materials.length; i++) {
					THREE.ImageUtils.loadTexture(textures[i], THREE.UVMapping, function (image) {
						materials[i] = new THREE.MeshBasicMaterial({ map: image })
					} );
				}

				console.log(materials);
				createHuman(geometry, materials);
			});
		});
	}
	
		function loadTextures(callback) {
			var loader = THREE.ImageUtils;
			var results = new Array();
/*
	
			for (var i=0; i<textures.length; i++) {
				loader.loadTexture(textures[i], THREE.UVMapping, function (image) {
					results.push(new THREE.MeshBasicMaterial({ map: image }));
				} );
			}
			
*/			
			callback(results);
		}

		function createHuman(geometry, materials) {
			var human = getHumanMesh(geometry, materials);
			scene.add(human);
		}

			function getHumanMesh(geometry, materials) {
				var human = new THREE.Mesh(geometry, materials);
				return setHumanPosition(human, 0, -50, 200);
			}
			
				function setHumanPosition(human, x, y, z) {
					human.position.set(x, y, z)
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