import { FLOW_STEPS, DEFAULT_VISUAL_THEME } from "../../app/constants.js";
import { createStatusGrid } from "../ui/status-grid/status-grid.js";
import { createFlowStepper } from "../ui/flow-stepper/flow-stepper.js";

export function createTelaInicio({ elements, state, navigateTo, getSelectedEquations, validateBingoParams }) {
	let flowActiveIndex = null;

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

		elements.inicioStatus.innerHTML = "";
		elements.inicioStatus.appendChild(
			createStatusGrid({ selectedTopics, selectedEquations, restrictedVars, generatedQuestions, generatedCards })
		);
	}

	function renderFlow() {
		if (!elements.inicioFlow) {
			return;
		}

		const statuses = FLOW_STEPS.map((step) => getFlowStepState(step.screen));
		const firstNonDoneIndex = statuses.findIndex((s) => s.tone !== "done");
		const defaultActive = firstNonDoneIndex === -1 ? 0 : firstNonDoneIndex;
		const initialActive = flowActiveIndex !== null
			? Math.min(flowActiveIndex, FLOW_STEPS.length - 1)
			: defaultActive;

		const stepper = createFlowStepper({
			steps: FLOW_STEPS,
			statuses,
			defaultActiveIndex: initialActive,
			onStepOpen: (screen) => navigateTo(screen),
			onActiveIndexChange: (idx) => { flowActiveIndex = idx; },
		});

		elements.inicioFlow.innerHTML = "";
		elements.inicioFlow.appendChild(stepper);
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