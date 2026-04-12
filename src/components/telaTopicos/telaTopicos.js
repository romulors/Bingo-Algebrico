import { createTopicCard } from "../ui/topic-card/topic-card.js";

export function createTelaTopicos({ elements, state, renderAll, saveState, showToast, onManualConfigChange, onTopicToggle }) {
	function render() {
		if (!elements.topicsList) {
			return;
		}

		elements.topicsList.innerHTML = "";

		const sortedTopics = [...state.topics].sort((a, b) => a.name.localeCompare(b.name, "pt"));

		sortedTopics.forEach((topic) => {
			const equationCount = state.equations.filter((equation) => equation.topicId === topic.id).length;
			const card = createTopicCard({
				topic,
				equationCount,
				onToggle: () => {
					topic.selected = !topic.selected;
					onManualConfigChange?.();
					if (!topic.selected) {
						state.equations
							.filter((equation) => equation.topicId === topic.id)
							.forEach((equation) => { equation.selected = false; });
					}
					if (onTopicToggle) {
						onTopicToggle(topic.id);
					} else {
						renderAll();
					}
					saveState();
				},
				onEdit:   (id) => editTopic(id),
				onRemove: (id) => removeTopic(id),
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
		removeTopic,
		patchCardSelection(topicId, isSelected) {
			const card = elements.topicsList?.querySelector(`[data-topic-id="${topicId}"]`);
			if (!card) return;
			card.classList.toggle("selected", isSelected);
			const statusEl = card.querySelector(".topicStatus");
			if (statusEl) statusEl.textContent = isSelected ? "Adicionado" : "Não adicionado";
		}
	};
}