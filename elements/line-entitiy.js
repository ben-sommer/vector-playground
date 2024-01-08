import * as THREE from "three";
import { plotLine } from "../js/plot.js";

class LineEntityElement extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.values = {
			a: {
				x: 0,
				y: 0,
				z: 0,
			},
			d: {
				x: 0,
				y: 0,
				z: 0,
			},
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
					align-items: top;
				}

				.remove {
					font-weight: 600;
					cursor: pointer;
				}
            </style>
            <div class="container">
                <div class="header">
					<p class="type">Line</p>
					<p class="remove">×</p>
				</div>
                <div class="inputs">
                    <p class="label">A</p>
                    <p>X:</p>
                    <input data-var="a" data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-var="a" data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-var="a" data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
                </div>
                <div class="inputs">
                    <p class="label">D</p>
                    <p>X:</p>
                    <input data-var="d" data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-var="d" data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-var="d" data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
                </div>
            </div>
        `;

		this.draw();

		this.shadow.querySelectorAll(".inputs input").forEach((el) => {
			el.addEventListener("input", (e) => {
				this.values[el.getAttribute("data-var")][
					el.getAttribute("data-coord")
				] = parseFloat(e.target.value) / 10;

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
			// Scene not yet defined
		}
	}

	createMesh() {
		let a = new THREE.Vector3();
		let d = new THREE.Vector3();

		{
			const { x, y, z } = this.values.a;
			a.set(x, y, z);
		}

		{
			const { x, y, z } = this.values.d;
			d.set(x, y, z);
		}

		const points = plotLine(a, d);

		const spline = new THREE.CatmullRomCurve3(points);

		const geometry = new THREE.TubeGeometry(spline, 10, 0.005, 16, false);

		const material = new THREE.LineBasicMaterial({
			color: 0xff0000,
			linewidth: 5.0,
			side: THREE.DoubleSide,
		});

		const line = new THREE.Mesh(geometry, material);

		scene.add(line);

		this.mesh = line;
	}
}

customElements.define("line-entity", LineEntityElement);
