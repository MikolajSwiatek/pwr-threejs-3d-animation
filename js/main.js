var camera, scene, renderer, geometry, material, mesh, controls, trackball;

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
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
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
	
		function createHuman(geometry, materials) {
			var material = new THREE.MeshNormalMaterial();
			var human = new THREE.Mesh(geometry, materials);
			human.position.x = 0;
			human.position.y = 0;
			human.position.z = 0;
			scene.add(human);
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
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
		
		controls.update();   
		renderer.render(scene, camera);
	}