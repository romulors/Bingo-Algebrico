import { FLOW_STEPS, DEFAULT_VISUAL_THEME } from "../../app/constants.js";

export function createTelaInicio({ elements, state, navigateTo, getSelectedEquations, validateBingoParams }) {
	function countConfiguredRestrictions() {
		return getSelectedEquations().reduce((total, equation) => {
			const configured = Object.keys(state.restrictions).filter((key) => key.startsWith(`${equation.id}::`)).length;
			return total + configured;
		}, 0);
	}

	function countRequiredRestrictions() {
		return getSelectedEquations().reduce((total, equation) => total + equation.variables.length, 0);
	}

	function getFlowStepState(screenName) {
		const selectedTopics = state.topics.filter((topic) => topic.selected).length;
		const selectedEquations = getSelectedEquations().length;
		const configuredRestrictions = countConfiguredRestrictions();
		const requiredRestrictions = countRequiredRestrictions();
		const bingoError = validateBingoParams();

		switch (screenName) {
			case "topicos":
				return selectedTopics > 0
					? { label: "Concluida", tone: "done" }
					: { label: "Pendente", tone: "pending" };
			case "equacoes":
				return selectedEquations > 0
					? { label: "Concluida", tone: "done" }
					: { label: "Pendente", tone: "pending" };
			case "restricoes":
				if (requiredRestrictions === 0) {
					return { label: "Aguardando equacoes", tone: "pending" };
				}

				if (configuredRestrictions >= requiredRestrictions) {
					return { label: "Concluida", tone: "done" };
				}

				if (configuredRestrictions > 0) {
					return { label: "Em andamento", tone: "in-progress" };
				}

				return { label: "Pendente", tone: "pending" };
			case "bingo":
				return bingoError
					? { label: "Revisar parametros", tone: "warning" }
					: { label: "Concluida", tone: "done" };
			case "questoes":
				return state.generatedQuestions.length > 0
					? { label: "Concluida", tone: "done" }
					: { label: "Pendente", tone: "pending" };
			case "visual": {
				const isCustomized = Object.keys(DEFAULT_VISUAL_THEME).some(
					(key) => state.visualTheme[key] !== DEFAULT_VISUAL_THEME[key]
				);
				return isCustomized
					? { label: "Personalizado", tone: "done" }
					: { label: "Opcional", tone: "optional" };
			}
			case "cartelas":
				return state.generatedCards.length > 0
					? { label: "Concluida", tone: "done" }
					: { label: "Pendente", tone: "pending" };
			case "persistencia":
				return { label: "Opcional", tone: "optional" };
			default:
				return { label: "Pendente", tone: "pending" };
		}
	}

	function renderStatus() {
		if (!elements.inicioStatus) {
			return;
		}

		const selectedTopics = state.topics.filter((topic) => topic.selected).length;
		const selectedEquations = state.equations.filter((equation) => equation.selected).length;
		const restrictedVars = countConfiguredRestrictions();
		const generatedQuestions = state.generatedQuestions.length;
		const generatedCards = state.generatedCards.length;

		elements.inicioStatus.innerHTML = `
			<div class="status-card">
				<span class="label">Tópicos selecionados</span>
				<span class="value">${selectedTopics}</span>
			</div>
			<div class="status-card">
				<span class="label">Equações selecionadas</span>
				<span class="value">${selectedEquations}</span>
			</div>
			<div class="status-card">
				<span class="label">Variáveis com restrição</span>
				<span class="value">${restrictedVars}</span>
			</div>
			<div class="status-card">
				<span class="label">Questões geradas</span>
				<span class="value">${generatedQuestions}</span>
			</div>
			<div class="status-card">
				<span class="label">Cartelas geradas</span>
				<span class="value">${generatedCards}</span>
			</div>
		`;
	}

	function renderFlow() {
		if (!elements.inicioFlow) {
			return;
		}

		const statuses = FLOW_STEPS.map((step) => getFlowStepState(step.screen));
		const firstNonDoneIndex = statuses.findIndex((s) => s.tone !== "done");
		const defaultActive = firstNonDoneIndex === -1 ? 0 : firstNonDoneIndex;

		let activeIndex = parseInt(elements.inicioFlow.dataset.activeIndex ?? defaultActive, 10);
		// Reset active if it's out of range (e.g. after a full re-render)
		if (activeIndex >= FLOW_STEPS.length) activeIndex = defaultActive;

		function buildTrack() {
			return FLOW_STEPS.map((step, index) => {
				const status = statuses[index];
				const isActive = index === activeIndex;
				const isDone = status.tone === "done";
				const connectorDone = index < FLOW_STEPS.length - 1 && isDone && statuses[index + 1].tone === "done";

				const connector = index < FLOW_STEPS.length - 1
					? `<div class="stepper-connector ${connectorDone ? "stepper-connector-done" : ""}"></div>`
					: "";

				return `
					<div class="stepper-node ${isActive ? "active" : ""} stepper-tone-${status.tone}" data-index="${index}">
						<div class="stepper-bubble">${String(index + 1).padStart(2, "0")}</div>
						<span class="stepper-label">${step.title}</span>
						<span class="stepper-status">${status.label}</span>
					</div>
					${connector}
				`;
			}).join("");
		}

		function buildDetail() {
			const step = FLOW_STEPS[activeIndex];
			const status = statuses[activeIndex];
			return `
				<div class="stepper-detail stepper-tone-${status.tone}">
					<p>${step.description}</p>
					<button class="botao botao-secundario stepper-open-btn" type="button" data-screen="${step.screen}">
						Abrir etapa
					</button>
				</div>
			`;
		}

		function render() {
			elements.inicioFlow.innerHTML = `
				<div class="stepper-track">${buildTrack()}</div>
				${buildDetail()}
			`;
			elements.inicioFlow.dataset.activeIndex = activeIndex;

			elements.inicioFlow.querySelectorAll(".stepper-node").forEach((node) => {
				node.addEventListener("click", () => {
					activeIndex = parseInt(node.dataset.index, 10);
					render();
				});
			});

			const openBtn = elements.inicioFlow.querySelector(".stepper-open-btn");
			if (openBtn) {
				openBtn.addEventListener("click", () => {
					const target = openBtn.dataset.screen;
					if (target) navigateTo(target);
				});
			}
		}

		render();
	}

	return {
		render() {
			renderStatus();
			renderFlow();
		},
		getStepStatuses() {
			return FLOW_STEPS.map((step) => ({
				screen: step.screen,
				tone: getFlowStepState(step.screen).tone
			}));
		}
	};
}