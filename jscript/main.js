var container = document.getElementById('threejs-container');

if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
	container.innerHTML = "";
}

app.init(container);
app.animate();