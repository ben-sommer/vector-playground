import * as THREE from "three";

const bound = 1;

/**
 * @param {THREE.Vector3} a
 * @param {THREE.Vector3} d
 */
export const plotLine = (a, d) => {
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
	)
		.map((x) => JSON.parse(x))
		.map(({ x, y, z }) => new THREE.Vector3(x, y, z));

	if (finalPoints.length != 2) {
		throw new Error("Invalid D vector");
	}

	return finalPoints;
};

export const parse = (expression) => {
	console.log(evaluatex(expression));
};
