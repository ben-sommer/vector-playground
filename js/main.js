import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
	addAxesLabels,
	drawGrids,
	rotateAxesLabels,
	updateVisibleGridLines,
} from "./axes.js";
import { parse, plotLine } from "./plot.js";
import "../elements/line-entity.js";
import "../elements/point-entity.js";
import "../elements/vector-entity.js";
import "./interface.js";

function main() {
	const canvas = document.querySelector("#canvas");
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

	const fov = 45;
	const aspect = 10;
	const near = 0.1;
	const far = 10;
	window.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(Math.E, 1.5, Math.E);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	window.scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	window.plotLine = plotLine;
	window.Vector3 = THREE.Vector3;
	window.parse = parse;

	window.axesLabels = addAxesLabels();
	drawGrids();

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width = (canvas.clientWidth * pixelRatio) | 0;
		const height = (canvas.clientHeight * pixelRatio) | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	updateVisibleGridLines();

	document.onmousemove = () => {
		updateVisibleGridLines();
	};

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		rotateAxesLabels();

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

main();
