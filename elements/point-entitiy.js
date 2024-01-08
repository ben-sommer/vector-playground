import * as THREE from "three";

class EntityElement extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.position = {
			x: 0,
			y: 0,
			z: 0,
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
            </style>
            <div class="container">
                <p class="type">Point</p>
                <div class="inputs">
                    <p>X:</p>
                    <input data-coord="x" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Y:</p>
                    <input data-coord="y" type="number" step="1" value="0" min="-10" max="10" />
                    <p>Z:</p>
                    <input data-coord="z" type="number" step="1" value="0" min="-10" max="10" />
                </div>
            </div>
        `;

		this.draw();

		this.shadow.querySelectorAll(".inputs input").forEach((el) => {
			el.addEventListener("input", (e) => {
				this.position[el.getAttribute("data-coord")] =
					parseFloat(e.target.value) / 10;

				this.draw();
			});
		});
	}

	draw() {
		try {
			if (!this.mesh) this.createMesh();

			const { x, y, z } = this.position;

			this.mesh.position.set(x, y, z);
		} catch (e) {
			// Scene not yet defined
		}
	}

	createMesh() {
		const geometry = new THREE.SphereGeometry(0.01, 32, 32);

		const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

		const sphere = new THREE.Mesh(geometry, material);

		const { x, y, z } = this.position;

		sphere.position.set(x, y, z);

		scene.add(sphere);

		this.mesh = sphere;
	}
}

customElements.define("point-entity", EntityElement);
