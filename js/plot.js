import * as THREE from "three";

const bound = 1;

/**
 * @param {THREE.Vector3} a
 * @param {THREE.Vector3} d
 */
export const plotLine = (scene, a, d) => {
	let points = [];

	for (let dimension = 0; dimension < 3; dimension++) {
		if (d[dimension] != 0) {
			for (let sign = -1; sign <= 1; sign += 2) {
				const lambda =
					(bound * sign - a.getComponent(dimension)) /
					d.getComponent(dimension);

				const point = a.clone().add(d.clone().multiplyScalar(lambda));

				const max = Math.max(...point.toArray());
				const min = Math.min(...point.toArray());

				if (max <= bound && min >= -bound) {
					points.push(point);
				}
			}
		}
	}

	const finalPoints = Array.from(
		new Set(points.map((x) => JSON.stringify(x)))
	).map((x) => new THREE.Vector3().fromArray(Object.values(JSON.parse(x))));

	if (finalPoints.length != 2) {
		throw new Error("Invalid D vector");
	}

	const spline = new THREE.CatmullRomCurve3(finalPoints);

	const geometry = new THREE.TubeGeometry(spline, 10, 0.01, 16, false);

	const material = new THREE.LineBasicMaterial({
		color: 0xff0000,
		linewidth: 5.0,
		side: THREE.DoubleSide,
	});

	const line = new THREE.Mesh(geometry, material);

	scene.add(line);

	return finalPoints;
};

export const parse = (expression) => {
	console.log(evaluatex(expression));
};
