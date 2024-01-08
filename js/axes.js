import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const axes = [
	{
		label: "X",
		direction: new THREE.Vector3(1, 0, 0),
		gridOffset: new THREE.Vector3(0, 0, 1),
		color: 0x0000ff,
	},
	{
		label: "Y",
		direction: new THREE.Vector3(0, 1, 0),
		gridOffset: new THREE.Vector3(1, 0, 0),
		color: 0x00ff00,
	},
	{
		label: "Z",
		direction: new THREE.Vector3(0, 0, 1),
		gridOffset: new THREE.Vector3(0, 1, 0),
		color: 0xff0000,
	},
];

/**
 * @param {THREE.Scene} scene
 */
export const addAxesLabels = (scene) => {
	const loader = new FontLoader();

	let labels = [];

	loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
		for (const axis of axes) {
			const geometry = new TextGeometry(axis.label, {
				font: font,
				height: 0.1,
			});

			geometry.center();

			const material = new THREE.MeshBasicMaterial({
				color: axis.color,
			});

			const label = new THREE.Mesh(geometry, material);

			label.position.set(...axis.direction.multiplyScalar(1.1));
			label.scale.set(...new THREE.Vector3().setScalar(0.0005));

			scene.add(label);

			labels.push(label);
		}
	});

	return labels;
};

/**
 * @param {THREE.Mesh[]} labels
 * @param {THREE.PerspectiveCamera} camera
 */
export const rotateAxesLabels = (labels, camera) => {
	for (const label of labels) {
		label.quaternion.copy(camera.quaternion);
	}
};

/**
 * @param {THREE.Scene} scene
 */
export const drawGrids = (scene) => {
	for (const axis of axes) {
		for (let i = -10; i <= 10; i += 1) {
			if (i == 0) {
				const arrow = new THREE.ArrowHelper(
					axis.direction,
					axis.direction.clone().multiplyScalar(-1),
					2,
					axis.color,
					0.05,
					0.03
				);

				arrow.cone.geometry.dispose();
				arrow.cone.geometry = new THREE.CylinderGeometry(
					0,
					0.5,
					1,
					10,
					1
				);
				arrow.cone.geometry.translate(0, -0.5, 0);

				scene.add(arrow);
			} else {
				const vectors = [
					axis.gridOffset.clone(),
					axis.direction.clone().cross(axis.gridOffset),
				];

				for (const vector of vectors) {
					const points = [
						axis.direction
							.clone()
							.add(vector.clone().multiplyScalar(i / 10)),
						axis.direction
							.clone()
							.add(vector.clone().multiplyScalar(-i / 10))
							.multiplyScalar(-1),
					];

					const geometry = new THREE.BufferGeometry().setFromPoints(
						points
					);

					const material = new THREE.LineBasicMaterial({
						color: i == 0 ? axis.color : 0xaaaaaa,
					});

					const line = new THREE.Line(geometry, material);

					scene.add(line);
				}
			}
		}
	}
};
