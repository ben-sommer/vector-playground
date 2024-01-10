import * as THREE from "three";
import { plotLine, plotPlane, plotPolygon } from "../js/plot.js";

class LineEntityElement extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.values = {
			n: {
				x: 0,
				y: 0,
				z: 0,
			},
			d: 0,
		};
		this.mesh = null;
	}

	connectedCallback() {
		this.shadow.innerHTML = `
            <style>
                .container {
                    background-color: #ddd;
                    border-radius: 4px;
                    padding: 8px;
                }

                p {
                    margin: 0px;
                }
                
                .type {
                    font-weight: 600;
                }

                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                input {
                    -moz-appearance: textfield;
                    width: 40px;
                    outline: none;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 4px;
                }

                .inputs {
                    display: flex;
                    column-gap: 8px;
                    margin-top: 8px;
                    align-items: center;
                }

                .label {
                    font-weight: 600;
                }

				.header {
					display: flex;
					justify-content: space-between;
					align-items: start;
				}

				.remove {
					font-weight: 600;
					cursor: pointer;
				}
            </style>
            <div class="container">
                <div class="header">
					<p class="type">Plane</p>
					<p class="remove">×</p>
				</div>
                <div class="inputs">
                    <p class="label">N</p>
                    <p>X:</p>
                    <input data-var="n" data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-var="n" data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-var="n" data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
                </div>
                <div class="inputs">
                    <p class="label">D</p>
                    <p>X:</p>
                    <input data-var="d" type="number" step="1" value="0" min="-18" max="18" />
                </div>
            </div>
        `;

		this.draw();

		this.shadow.querySelectorAll(".inputs input").forEach((el) => {
			el.addEventListener("input", (e) => {
				if (el.getAttribute("data-coord")) {
					this.values[el.getAttribute("data-var")][
						el.getAttribute("data-coord")
					] = parseFloat(e.target.value) / 10;
				} else {
					this.values[el.getAttribute("data-var")] =
						parseFloat(e.target.value) / 10;
				}

				this.draw();
			});
		});

		this.shadow.querySelector(".remove").addEventListener("click", () => {
			this.parentNode.removeChild(this);
		});
	}

	draw() {
		try {
			if (this.mesh) scene.remove(this.mesh);

			this.createMesh();
		} catch (e) {
			console.log(e);
			// Scene not yet defined
		}
	}

	createMesh() {
		let n = new THREE.Vector3();
		let d = -this.values.d;

		{
			const { x, y, z } = this.values.n;
			n.set(x, y, z);
		}

		const vertices = plotPlane(n, d);

		const { geometry, centroid } = plotPolygon(vertices, n, d);

		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			side: THREE.DoubleSide,
		});

		const plane = new THREE.Mesh(geometry, material);

		plane.position.copy(centroid);

		scene.add(plane);

		this.mesh = plane;
	}
}

customElements.define("plane-entity", LineEntityElement);
