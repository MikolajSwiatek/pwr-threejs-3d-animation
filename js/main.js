	var camera, scene, controls, renderer;

	init();
	animate();

	function init() {
	    scene = new THREE.Scene();
	    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

	    camera.position.z = 10;

	    var light = new THREE.DirectionalLight(0xffffff, 1);
	    light.position.set(100, 10, 10);
	    scene.add(light);

	    controls = new THREE.OrbitControls(camera);
	    controls.addEventListener('change', render);

	    renderer = new THREE.WebGLRenderer({alpha: true});
	    renderer.setClearColor(0x000000, 0); // the default
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    document.body.appendChild(renderer.domElement);

	    var jsonLoader = new THREE.JSONLoader();
	    var mesh;
	    jsonLoader.load('model/model.json',
		function (geometry, materials) {
		    var material = new THREE.MeshFaceMaterial(materials);
		    mesh = new THREE.Mesh(geometry, material);

		    scene.add(mesh);
		}
	    );

	}

	function animate() {

	    requestAnimationFrame(animate);
	    controls.update();

	    render();
	}

	function render() {
	    renderer.render(scene, camera);
	}