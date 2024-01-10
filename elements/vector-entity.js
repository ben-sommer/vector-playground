import * as THREE from "three";
import { plotLine } from "../js/plot.js";

class LineEntityElement extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.values = {
			o: {
				x: 0,
				y: 0,
				z: 0,
			},
			v: {
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
					align-items: start;
				}

				.remove {
					font-weight: 600;
					cursor: pointer;
				}
            </style>
            <div class="container">
                <div class="header">
					<p class="type">Vector</p>
					<p class="remove">×</p>
				</div>
                <div class="inputs">
                    <p class="label">O</p>
                    <p>X:</p>
                    <input data-var="o" data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-var="o" data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-var="o" data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
                </div>
                <div class="inputs">
                    <p class="label">V</p>
                    <p>X:</p>
                    <input data-var="v" data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-var="v" data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-var="v" data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
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
		let o = new THREE.Vector3();
		let v = new THREE.Vector3();

		{
			const { x, y, z } = this.values.o;
			o.set(x, y, z);
		}

		{
			const { x, y, z } = this.values.v;
			v.set(x, y, z);
		}

		const arrow = new THREE.ArrowHelper(
			v.clone().normalize(),
			o,
			v.length(),
			0xff0000,
			0.05,
			0.03
		);

		arrow.cone.geometry.dispose();
		arrow.cone.geometry = new THREE.CylinderGeometry(0, 0.5, 1, 10, 1);
		arrow.cone.geometry.translate(0, -0.5, 0);

		scene.add(arrow);

		this.mesh = arrow;
	}
}

customElements.define("vector-entity", LineEntityElement);
