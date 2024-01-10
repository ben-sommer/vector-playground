document.getElementById("new").addEventListener("change", (e) => {
	try {
		const element = document.createElement(`${e.target.value}-entity`);

		document.querySelector(".entities").appendChild(element);
	} catch (e) {}

	e.target.value = "";
});
