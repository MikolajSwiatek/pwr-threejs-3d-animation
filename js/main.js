var app = {
	scene: null,
	camera: null,
	cube: null,
	character: null,
	controls: null, 
	trackball: null, 
	statsApp: null, 
	context: null, 
	clock: null, 
	mixer: null,
	light: null,
	delta: null,
	helper: new Helper(),
	
	init: function(fileName) {
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		
		this.setCamera(50, 50, 700);
		this.setTrackBall();
		this.setRenderer();
		this.setLight(new THREE.HemisphereLight(0xffffff, 0xffffff));
		this.load(fileName);
		this.setOrbitControls();
		
		document.body.appendChild(this.renderer.domElement);
		this.renderer.render(this.scene, this.camera);
	},

	setCamera: function(x, y, z) {
		this.camera = new THREE.PerspectiveCamera(
			75, 
			window.innerWidth / window.innerHeight, 
			1, 
			10000);
			
		this.camera.position.set(x, y, z);
		this.camera.lookAt(this.scene.position);
	},
	
	setTrackBall: function() {
		this.trackball = new THREE.TrackballControls(this.camera);
		this.trackball.rotateSpeed = 1.0;
		this.trackball.zoomSpeed = 1.2;
		this.trackball.panSpeed = 0.8;
		this.trackball.noZoom = false;
		this.trackball.noPan = false;
		this.trackball.staticMoving = true;
		this.trackball.dynamicDampingFactor = 0.3;
		this.trackball.keys = [ 65, 83, 68 ];
		this.trackball.addEventListener('change', this.render);
	},
	
	setRenderer: function() {
		this.renderer = new THREE.CanvasRenderer();
		this.renderer.setClearColor(0xdddddd);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapSoft = true;
	},
	
	setLight: function(lightType) {
		this.light = lightType;
		this.scene.add(this.light);
	},
	
	createCube:function(x, y, z) {
		this.cube = new Cube()
		this.cube.create(x, y, z, new THREE.MeshNormalMaterial());	
	},
	
	load: function(fileName) {
		var loader = new THREE.JSONLoader();
		loader.load(this.helper.getModel(fileName), function (geometry, materials) {
            app.character = new Character();
			app.character.init(geometry, materials, app.helper);
			app.character.setPosition(150, 0, 400);
			app.saveMeshs();
			app.setMixer();
		});
	},
	
	saveMeshs: function() {
		if (this.character != null)
			this.scene.add(this.character.mesh);
			
		if (this.cube != null)
			this.scene.add(this.cube.mesh);
	},
	
	setMixer: function() {
		this.mixer = new THREE.AnimationMixer(this.character.mesh);
		//for (var i=0; i<this.character.animations.length; i++) {
		for (var i=0; i<3; i++) {
			this.mixer.clipAction(this.character.animations[i]).play();
			this.mixer._actions[i].weight = 0;
		}
		
		if (this.mixer._actions[0] != undefined) {
			this.mixer._actions[0].weight = 1;
		}
	},
	
	setOrbitControls: function() {
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
	},
	
	animate: function() {
		this.delta = this.clock.getDelta();
		if(this.mixer) 
			this.mixer.update(this.delta);
			
		this.controls.update();  
		this.render();
	},
	
	render: function() {
		this.cube.move(0.01, 0.02);
		this.renderer.render(this.scene, this.camera);
	},
	
	onWindowResize: function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}  
};


function Helper() {
	this.locationFiles = {
		model: "model/",
		textures: "img/textures/"
	};
	
	this.getModel = function(name) {
		return this.locationFiles.model + name;
	};
	
	this.getTexture = function(name) {
		return this.locationFiles.textures + name;
	};
}

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

function Cube() {
	this.geometry = null,
	this.material = null,
	this.mesh = null,
	
	this.create = function(x, y, z, m) {
		this.geometry = new THREE.CubeGeometry(x, y, z);
		this.material = m;
		this.mesh = new THREE.Mesh(
			this.geometry, 
			this.material);
	};
	
	this.add = function(scene) {
		scene.add(this.camera);
		scene.add(this.mesh);
	};
	
	this.move = function(x, y) {
		this.mesh.rotation.x += x;
		this.mesh.rotation.y += y;
	};
};

function Character() {
	this.geometry = null;
	this.materials = null;
	this.animations = null;
	this.mesh = null;
	
	this.init = function(geometry, mat, helper) {
		this.animations = geometry.animations;
		this.geometry = geometry;
		
		if (mat != undefined) {
			if (mat.length > 1) {
				for(var i=0; i<mat.length; i++) {     
					var texture = this.loadTexture(helper, i);       
					mat[i] = this.getMaterial(texture);
					mat[i].skinning = true;
					mat[i].side = THREE.DoubleSide;
					mat[i].shading = THREE.FlatShading;
				}
				
			this.materials = mat;
			this.mesh = new THREE.Mesh(
				this.geometry, 
				new THREE.MeshFaceMaterial(this.materials));
			}
			else {
				mat.side = THREE.DoubleSide;
				mat.shading = THREE.FlatShading;
				mat.skinning = true;
				this.materials = mat;
				this.mesh = new THREE.SkinnedMesh(geometry,mat);
			}
		}
	};
	
	this.getMaterial = function(material) {
		return new THREE.MeshBasicMaterial({ map: material });
	};
	
	this.loadTexture = function(helper, i) {
		return THREE.ImageUtils.loadTexture(
			helper.getTexture(textures[i]));
	};
	
	this.setPosition = function(x, y, z) {
		this.mesh.position.set(x, y, z);
	};
};

function Menu() {
	
};

var stats = {
	statsApp: null,
	context: null,
	init: function() {
		this.statsApp = new Stats();
		statsApp.showPanel(1);
		document.body.appendChild(statsApp.dom);
		
		var canvas = document.createElement('canvas');
		canvas.width = 0;
		canvas.height = 0;
		document.body.appendChild(canvas);
		
		this.context = canvas.getContext( '2d' );
		this.context.fillStyle = 'rgba(127,0,255,0.05)';
	}
};

window.onload = function() {
  var text = new Menu();
  var gui = new DAT.GUI();
  //gui.add(text, 'message');
  
  app.createCube(100, 100, 100);
  //app.init("model1.json");
  app.init("trying_mirror.json");
  animate();
};

window.addEventListener( 'resize', app.onWindowResize, false );  

function animate() {
	app.animate();
	requestAnimationFrame(animate);
}