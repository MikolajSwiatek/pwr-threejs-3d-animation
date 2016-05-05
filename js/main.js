var camera, scene, renderer, geometry, material, mesh, controls;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;
	
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
	
    scene.add(camera);
	
    geometry = new THREE.CubeGeometry(200, 200, 200);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
	
	var loader = new THREE.JSONLoader();
        loader.load( 'model/model.json', function ( geometry, materials ) {
		var material = new THREE.MeshFaceMaterial(materials);
        var human = new THREE.Mesh( geometry, materials );
		human.position.x = 100;
		human.position.y = 100;
		human.position.z = 100;
		scene.add( human );
	}); 

    document.body.appendChild(renderer.domElement);
	renderer.render(scene, camera);
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
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