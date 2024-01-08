import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
	addAxesLabels,
	drawGrids,
	rotateAxesLabels,
	updateVisibleGridLines,
} from "./axes.js";
import { parse, plotLine } from "./plot.js";

function main() {
	const canvas = document.querySelector("#canvas");
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

	const fov = 45;
	const aspect = 10;
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(Math.E, 1.5, Math.E);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	const axesLabels = addAxesLabels(scene);
	window.lines = drawGrids(scene, camera);

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

	updateVisibleGridLines(camera, lines);

	document.onmousemove = () => {
		updateVisibleGridLines(camera, lines);
	};

	window.plotLine = plotLine;
	window.Vector3 = THREE.Vector3;
	window.scene = scene;
	window.parse = parse;
	window.camera = camera;

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		rotateAxesLabels(axesLabels, camera);

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

main();
