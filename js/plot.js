import * as THREE from "three";

const bound = 1;

const cubeVertices = [
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(1, -1, -1),
	new THREE.Vector3(1, 1, -1),
	new THREE.Vector3(-1, 1, -1),
	new THREE.Vector3(-1, -1, 1),
	new THREE.Vector3(1, -1, 1),
	new THREE.Vector3(1, 1, 1),
	new THREE.Vector3(-1, 1, 1),
];

const getIntersectionPoint = (planeNormal, planeD, p1, p2) => {
	const t =
		-(planeNormal.dot(p1) + planeD) / planeNormal.dot(p2.clone().sub(p1));

	return p1.clone().add(p2.clone().sub(p1).multiplyScalar(t));
};

function ensureWindingOrder(vertices) {
	let newVertices = vertices.slice();

	const normal = new THREE.Vector3().crossVectors(
		newVertices[1].clone().sub(newVertices[0]),
		newVertices[2].clone().sub(newVertices[0])
	);

	// Reverse the order if the normal is pointing in the opposite direction
	if (normal.dot(newVertices[0]) < 0) {
		newVertices.reverse();
	}

	return newVertices;
}

const findPolygonVertices = (planeNormal, planeD) => {
	const polygonVertices = [];

	// Define the cube edges
	const cubeEdges = [
		[cubeVertices[0], cubeVertices[1]],
		[cubeVertices[1], cubeVertices[2]],
		[cubeVertices[2], cubeVertices[3]],
		[cubeVertices[3], cubeVertices[0]],
		[cubeVertices[4], cubeVertices[5]],
		[cubeVertices[5], cubeVertices[6]],
		[cubeVertices[6], cubeVertices[7]],
		[cubeVertices[7], cubeVertices[4]],
		[cubeVertices[0], cubeVertices[4]],
		[cubeVertices[1], cubeVertices[5]],
		[cubeVertices[2], cubeVertices[6]],
		[cubeVertices[3], cubeVertices[7]],
	];

	// Check each cube edge for intersection with the plane
	cubeEdges.forEach((edge) => {
		const [p1, p2] = edge;
		const d1 = planeNormal.dot(p1) + planeD;
		const d2 = planeNormal.dot(p2) + planeD;

		if ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) {
			const intersectionPoint = getIntersectionPoint(
				planeNormal,
				planeD,
				p1,
				p2
			);
			polygonVertices.push(intersectionPoint);
		}
	});

	return polygonVertices;
};

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

export const plotPlane = (n, d) => {
	const polygonVertices = findPolygonVertices(n.clone().normalize(), d);

	return ensureWindingOrder(polygonVertices);
};

export const plotPolygon = (polygonVertices, n, d) => {
	const centroid = new THREE.Vector3();
	for (const vertex of polygonVertices) {
		centroid.add(vertex);
	}
	centroid.divideScalar(polygonVertices.length);

	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array(polygonVertices.length * 3);

	const planeNormal = n.clone().normalize();

	const updatedPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
		planeNormal,
		polygonVertices[0]
	);
	updatedPlane.constant = d;

	for (let i = 0; i < polygonVertices.length; i++) {
		const vertex = polygonVertices[i].clone().projectOnPlane(planeNormal);
		vertices[i * 3] = vertex.x;
		vertices[i * 3 + 1] = vertex.y;
		vertices[i * 3 + 2] = vertex.z;
	}

	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

	// Manually create faces for the geometry
	const indices = [];
	for (let i = 0; i < polygonVertices.length; i++) {
		indices.push(
			i,
			(i + 1) % polygonVertices.length,
			(i + 2) % polygonVertices.length
		);
	}

	geometry.setIndex(indices);

	return { geometry, centroid };
};
