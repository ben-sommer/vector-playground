import * as THREE from "three";

export const addAxes = (scene) => {
	// X Axis
	{
		const points = [
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(1, 0, 0),
		];

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({
			color: 0x0000ff,
		});

		const line = new THREE.Line(geometry, material);

		scene.add(line);
	}

	// Y Axis
	{
		const points = [
			new THREE.Vector3(0, -1, 0),
			new THREE.Vector3(0, 1, 0),
		];

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({
			color: 0x00ff00,
		});

		const line = new THREE.Line(geometry, material);

		scene.add(line);
	}

	// Z Axis
	{
		const points = [
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(0, 0, 1),
		];

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({
			color: 0xff0000,
		});

		const line = new THREE.Line(geometry, material);

		scene.add(line);
	}
};
