var camera, scene, renderer, geometry, material, mesh, controls, trackball, statsApp, context, clock, mixer;
var animations = [];

var textures = [
    "tongue01_diffuse.png",
	"male02_diffuse_black.png",
	"young_lightskinned_male_diffuse.png",
	"jeans01_black_diffuse.png",
	"classicshoes_texture_diffuse_black.png",
	"eyelashes01.png",
	"eyebrow001.png",
	"brown_eye.png",
	"tshirt02_normals.png",
];

var LocationFiles = {
	model: "model/",
	textures: "img/textures/"
};

	function getModel(name) {
		return LocationFiles.model + name;
	}

	function getTexture(name) {
		return LocationFiles.textures + name;
	}
	
var Menu = function() {
  //this.message = 'dat.gui';
}

window.onload = function() {
  var text = new Menu();
  var gui = new DAT.GUI();
  //gui.add(text, 'message');
};

window.addEventListener( 'resize', onWindowResize, false );  

init();
animate();

function init() {
    createClock();
	createStats();
    createScene();
	createCamera();
	createTrackball();
	createCube();
    //addFloor();
	addedCubeAndCameraToScene();
	createRenderer();
	createLight();
	addedHuman();
	addedRenderer();
	createOrbitControls();
}

    function createClock() {
        clock = new THREE.Clock();
    }

	function createStats() {
		var statsApp = new Stats();
		statsApp.showPanel(1);
		document.body.appendChild( statsApp.dom );
		var canvas = document.createElement( 'canvas' );
		canvas.width = 0;
		canvas.height = 0;
		document.body.appendChild( canvas );
		context = canvas.getContext( '2d' );
		context.fillStyle = 'rgba(127,0,255,0.05)';
	}

	function createScene() {
		scene = new THREE.Scene();
	}

	function createCamera() {
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(50, 50, 700);
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
		geometry = createCubeGeometry(100, 100, 100);
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh(geometry, material);
	}
    
        function createCubeGeometry(x, y, z) {
            return new THREE.CubeGeometry(x, y, z);
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
		var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
		scene.add(hemi);
	}
    
    function addFloor() {
        scene.add(createFloor());
    }
    
        function createFloor() {
            var plane = new THREE.PlaneGeometry(2000, 2000, 5, 5);
            plane.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
            
            var texture = THREE.ImageUtils.loadTexture('img/desert.jpg');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(64, 64);
            
            material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
            return new THREE.Mesh(plane, material);
        }

	function addedHuman() {
		var loader = new THREE.JSONLoader();
		loader.load(getModel('model1.json'), function (geometry, materials) {
            saveAnimations(geometry);
			for(var i=0; i<materials.length; i++) {                
                materials[i] = getMaterial(i);
                materials[i].skinning = true;
			}
			createHuman(geometry, materials);
		});
	}
        function saveAnimations(geometry) {
            animations = geometry.animations;
        }
        
        function getMaterial(i) {
            return new THREE.MeshBasicMaterial({ map: loadTexture(i) });
        }
            
            function loadTexture(i) {
                return THREE.ImageUtils.loadTexture(getTexturPath(i));
            }
            
                function getTexturPath(i) {
                    return getTexture(textures[i]);
                }
	
		function createHuman(geometry, materials) {
			var human = getHumanMesh(geometry, materials);
			scene.add(human);
            
            createAnimation(human, 0);
		}

			function getHumanMesh(geometry, materials) {
				var human = new THREE.Mesh(geometry, 
                    new THREE.MeshFaceMaterial(materials));
				return setHumanPosition(human, -150, 0, 400);
			}
			
				function setHumanPosition(human, x, y, z) {
					human.position.set(x, y, z)
					return human;
				}
         
         function createAnimation(human, number) {
             mixer = new THREE.AnimationMixer(human);
					mixer.clipAction(animations[ 0 ]).play();
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
    //THREE.AnimationHandler.update( clock.getDelta() );
    controls.update();  
    update();
    render();
}

	function render() {
		//meshRotation(0.01, 0.02);
		renderer.render(scene, camera);
	}
	
		function meshRotation(x, y) {
			mesh.rotation.x += x;
			mesh.rotation.y += y;
		}
		
	function update() {
        var delta = clock.getDelta();
        //THREE.AnimationHandler.update(delta);
    }
	
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}  