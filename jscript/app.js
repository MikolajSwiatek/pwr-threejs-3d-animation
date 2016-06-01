var app = {			
	camera: null,
	scene: null, 
	renderer: null,
    container: null,
    
	controls: null, 
	trackball: null,
    keyboardInteraction: null,
	text: [],
	clock: null,
	time: null,
	delta: null,
	animation: null,
	cameraLocked: false,
	mixer: null,
	cube: null,
	character: null,
	
    angleX: 0,
	angleY: -Math.PI*0.1,		
            
    init: function (container) 
    {
        app.scene = new THREE.Scene();
		app.clock = new THREE.Clock();
        app.animation = new AnimationController();
        app.container = container;
        
	    //app.keyboardInteraction = new THREE.KeyboardState();
	   		
        app.setCamera();
        app.setRenderer();
        app.setTrackBall();
        app.setOrbitControls();
        app.addCube();
		app.loadCharacter();
    },
    
    setCamera: function() {
        var sizeX = 40;
        var sizeY = 50;
        app.camera = new THREE.PerspectiveCamera(sizeX, sizeX/sizeY, 0.01, 10000);
        app.camera.position.z = 70;
        app.camera.position.y = 0; 
        app.camera.lookAt(app.scene.position);
    },
    
    setRenderer: function() {
        container.innerHTML = "";
        app.renderer = new THREE.WebGLRenderer({
            antialias:true,  
            clearColor: 0xdddddd,	
            alpha: true 
        });
        
        app.renderer.sortObjects = true;
        app.renderer.autoClear = true;
        app.renderer.setSize(window.innerWidth, window.innerHeight);
        app.container.appendChild(app.renderer.domElement);
    },
    
    setTrackBall: function() {
		app.trackball = new THREE.TrackballControls(app.camera);
		app.trackball.rotateSpeed = 1.0;
		app.trackball.zoomSpeed = 1.2;
		app.trackball.panSpeed = 0.8;
		app.trackball.noZoom = false;
		app.trackball.noPan = false;
		app.trackball.staticMoving = true;
		app.trackball.dynamicDampingFactor = 0.3;
		app.trackball.keys = [ 65, 83, 68 ];
		app.trackball.addEventListener('change', app.render);
	},
    
    setOrbitControls: function() {
		app.controls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
		app.controls.enableDamping = true;
		app.controls.dampingFactor = 0.25;
	},
    
    keyboardInfo: function() {		
		var forwardDirection = app.cameraLookDir(app.camera);
		var strafeDirection = new THREE.Vector3();
		strafeDirection.crossVectors(forwardDirection, app.camera.up);
	
		var forwardScale = 0.0;
		forwardScale += app.keyboardInteraction.pressed("w") ? 1.0 : 0.0;
		forwardScale -= app.keyboardInteraction.pressed("s") ? 1.0 : 0.0;
		
		var strafeScale = 0.0;
		strafeScale += app.keyboardInteraction.pressed("d") ? 1.0 : 0.0;
		strafeScale -= app.keyboardInteraction.pressed("a") ? 1.0 : 0.0;
			 
		forwardDirection.multiplyScalar(forwardScale);
		strafeDirection.multiplyScalar(strafeScale);
		
		app.camera.position.add(forwardDirection);
		app.camera.position.add(strafeDirection);

		if(app.keyboardInteraction.pressed("e"))
			app.calculateCameraRotation(10,0);
		if(app.keyboardInteraction.pressed("q"))
			app.calculateCameraRotation(-10,0);
		if(app.keyboardInteraction.pressed("z"))
			app.calculateCameraRotation(0,10);
		if(app.keyboardInteraction.pressed("c"))
			app.calculateCameraRotation(0,-10);
		
	},
    
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    },
    
    calculateCameraRotation: function(movementX, movementY)
	{
		var x = movementX/app.renderer.domElement.width;
		var y = movementY/app.renderer.domElement.height;	
				
		app.angleX -= Math.atan(x)*1.0;
		app.angleY -= Math.atan(y)*1.0;
				
		var frontDirection = new THREE.Vector3(0,0,0)
		frontDirection.copy(app.cameraLookDir(camera));
		frontDirection.sub(camera.position);
		frontDirection.normalize();
		
		var quatX = new THREE.Quaternion();
		var quatY = new THREE.Quaternion();
		quatX.setFromAxisAngle( new THREE.Vector3(0,1,0), app.angleX);
		quatY.setFromAxisAngle( new THREE.Vector3(1,0,0), app.angleY);
		camera.quaternion.multiplyQuaternions(quatX,quatY);
	},
    
    addCube: function() {
        app.cube = new Cube()
		app.cube.create(100,100, 100);	
    },
	
	loadCharacter: function()
	{
		var loader = new THREE.JSONLoader;
		loader.load('./models/trying_mirror.json', function (geometry, materials) {
			var mat = materials[0];
			mat.skinning = true;
			mat.side = THREE.DoubleSide;
			mat.shading = THREE.FlatShading;
            
			app.character = new THREE.SkinnedMesh(geometry,mat);
			
			app.scene.add(app.character);
				
			app.character.position.set(0, -5, 0);
			app.character.scale.set(1, 1, 1);
		
			app.mixer = new THREE.AnimationMixer(app.character);
			
			app.mixer.clipAction(app.character.geometry.animations[0], 0).play();
			app.mixer.clipAction(app.character.geometry.animations[1], 0).play();
			app.mixer.clipAction(app.character.geometry.animations[2], 0).play();
			app.mixer._actions[0].weight = 0;
			app.mixer._actions[1].weight = 1;			
			app.mixer._actions[2].weight = 0;		
		});
        
       app.cube.add(app.scene);
	},

	render: function ()
	{
        app.cube.move(0.01, 0.02);
		app.renderer.render(app.scene, app.camera);
		//app.keyboardInfo();
	},
	
    animate: function () 
    {
        app.animation.set();
        
		app.delta = app.clock.getDelta();
        
		if(app.mixer) {
			app.mixer.update(app.delta);
        }
        
        if (app.controls != null && app.controls != undefined) {
            app.controls.update();  
        }
        
        window.requestAnimationFrame(app.animate);
		app.render();	
    }
  };
  
function Cube() {
	this.geometry = null,
	this.material = null,
	this.mesh = null,
	
	this.create = function(x, y, z) {
		this.geometry = new THREE.BoxGeometry(200, 200, 200, 50, 50, 50);
		this.material = new THREE.MeshNormalMaterial({color: 0xfffff, wireframe: true});
		this.mesh = new THREE.Mesh(
			this.geometry, 
			this.material);
	};
	
	this.add = function(scene) {
		scene.add(this.mesh);
	};
	
	this.move = function(x, y) {
		this.mesh.rotation.x += x;
		this.mesh.rotation.y += y;
	};
};

var menu = {
	animation1: true,
    animation2: false,
	animation3: false,
    pouse: false
};

function AnimationController() {
    this.prev = null,
    this.play = 0,
    
    this.set = function() {
        var now = this.check();
        if (now != this.play) {
            this.prev = this.play;
            this.play = now;
            this.setAnimation();
        }
    },
    
    this.check = function() {
        var now = null;
        
        if (menu.animation1 == true) {
            now = 0;
        }
        else {
            if (menu.animation2 == true) {
                now = 1;
            }
            else if (menu.animation3 == true) {
                now = 2;
            }
            else {
                now = -1;
            }
        }
        
        return now
    },
    
    this.setAnimation = function() {
        if (this.play == 0) {
            app.mixer._actions[0].weight = 1;
            app.mixer._actions[1].weight = 0;
            app.mixer._actions[2].weight = 0;
        }
        else if (this.play == 1) {
            app.mixer._actions[0].weight = 0;
            app.mixer._actions[1].weight = 1;
            app.mixer._actions[2].weight = 0;
        }
        else if (this.play == 2) {
            app.mixer._actions[0].weight = 0;
            app.mixer._actions[1].weight = 0;
            app.mixer._actions[2].weight = 1;
        }
        else {
            app.mixer._actions[0].weight = 0;
            app.mixer._actions[1].weight = 0;
            app.mixer._actions[2].weight = 0;
        }
    }
};

var stats = {
	statsApp: null,
	context: null,
	init: function() {
		stats.statsApp = new Stats();
		stats.statsApp.showPanel(1);
		document.body.appendChild(stats.statsApp.dom);
		
		var canvas = document.createElement('canvas');
		canvas.width = 0;
		canvas.height = 0;
		document.body.appendChild(canvas);
		
		stats.context = canvas.getContext( '2d' );
		stats.context.fillStyle = 'rgba(127,0,255,0.05)';
	}
};

window.onload = function() {
  var gui = new DAT.GUI();
    
  gui.add(menu, 'animation1').onChange(function(newValue) {
	menu.animation1 = true;
    menu.animation2 = false;
	menu.animation3 = false;     
    menu.pouse = false;
    })
  .listen();
  
  gui.add(menu, 'animation2')
  .onChange(function(newValue) {
	menu.animation1 = false;
    menu.animation2 = true;
	menu.animation3 = false;     
    menu.pouse = false;
    })
  .listen();
  
  gui.add(menu, 'animation3').onChange(function(newValue) {
	menu.animation1 = false;
    menu.animation2 = false;
	menu.animation3 = true;      
    menu.pouse = false;
    })
  .listen();
    
  gui.add(menu, 'pouse').onChange(function(newValue) {
	menu.animation1 = false;
    menu.animation2 = false;
	menu.animation3 = false;   
    menu.pouse = true;
    })
  .listen();
  
  //stats.init();
};
