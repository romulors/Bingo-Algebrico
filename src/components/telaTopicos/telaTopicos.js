export function createTelaTopicos({ elements, state, renderAll, saveState, showToast, onManualConfigChange }) {
	function render() {
		if (!elements.topicsList) {
			return;
		}

		elements.topicsList.innerHTML = "";

		state.topics.forEach((topic) => {
			const totalEquations = state.equations.filter((equation) => equation.topicId === topic.id).length;
			const card = document.createElement("article");
			card.className = `topicCard ${topic.selected ? "selected" : ""}`;

			card.innerHTML = `
				<span class="topicName">${topic.name}</span>
				<span class="topicNumberOfQuestions">${totalEquations} Equações</span>
				<div class="topicFooter">
					<span class="icon-btn success editTopicButton" title="Editar tópico"><i class="fas fa-wrench"></i></span>
					<span class="topicStatus">${topic.selected ? "Adicionado" : "Não adicionado"}</span>
					<span class="icon-btn danger deleteTopicButton" title="Remover tópico"><i class="fas fa-xmark"></i></span>
				</div>
			`;

			card.addEventListener("click", () => {
				topic.selected = !topic.selected;
				onManualConfigChange?.();

				if (!topic.selected) {
					state.equations
						.filter((equation) => equation.topicId === topic.id)
						.forEach((equation) => {
							equation.selected = false;
						});
				}

				renderAll();
				saveState();
			});

			const editButton = card.querySelector(".editTopicButton");
			const deleteButton = card.querySelector(".deleteTopicButton");

			editButton.addEventListener("click", (event) => {
				event.stopPropagation();
				editTopic(topic.id);
			});

			deleteButton.addEventListener("click", (event) => {
				event.stopPropagation();
				removeTopic(topic.id);
			});

			elements.topicsList.appendChild(card);
		});
	}

	function addTopic() {
		const name = elements.inputNovoTopicoNome?.value || "";

		if (!name || !name.trim()) {
			showToast("Informe um nome para o tópico.");
			return;
		}

		state.customTopicCounter += 1;

		state.topics.push({
			id: `topic::custom::${state.customTopicCounter}`,
			name: name.trim(),
			selected: true,
			source: "custom"
		});

		if (elements.inputNovoTopicoNome) {
			elements.inputNovoTopicoNome.value = "";
		}

		renderAll();
		saveState();
		showToast("Tópico adicionado.");
	}

	function editTopic(topicId) {
		const topic = state.topics.find((item) => item.id === topicId);

		if (!topic) {
			return;
		}

		const newName = prompt("Editar nome do tópico:", topic.name);

		if (!newName || !newName.trim()) {
			return;
		}

		topic.name = newName.trim();
		renderAll();
		saveState();
		showToast("Tópico atualizado.");
	}

	function removeTopic(topicId) {
		const topic = state.topics.find((item) => item.id === topicId);

		if (!topic) {
			return;
		}

		const confirmed = confirm(`Remover o tópico "${topic.name}" e suas equações?`);

		if (!confirmed) {
			return;
		}

		const equationIdsToRemove = state.equations
			.filter((equation) => equation.topicId === topicId)
			.map((equation) => equation.id);

		state.topics = state.topics.filter((item) => item.id !== topicId);
		state.equations = state.equations.filter((equation) => equation.topicId !== topicId);

		Object.keys(state.restrictions).forEach((restrictionKey) => {
			if (equationIdsToRemove.some((equationId) => restrictionKey.startsWith(`${equationId}::`))) {
				delete state.restrictions[restrictionKey];
			}
		});

		renderAll();
		saveState();
		showToast("Tópico removido.");
	}

	return {
		render,
		addTopic,
		editTopic,
		removeTopic
	};
}