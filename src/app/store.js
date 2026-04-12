import { STORAGE_KEY } from "./constants.js";

export function createInitialState() {
    return {
        currentScreen: "inicio",
        topics: [],
        equations: [],
        restrictions: {},
        bingoParams: {
            numQuestoesUnicas: 20,
            numCartelas: 20,
            numQuestoesPorCartela: 6,
            minRepeticoes: 2,
            maxRepeticoes: 5
        },
        generatedQuestions: [],
        generatedCards: [],
        cardDisplayMode: "professor",
        visualTheme: {
            nomeBingo: "BINGO ALGÉBRICO",
            nomeInstituicao: "",
            corPrimaria: "#03233e",
            corDestaque: "#64b0f2",
            corFundo: "#f3f4fa"
        },
        customTopicCounter: 0,
        customEquationCounter: 0,
        questionCounter: 0,
        focusedRestrictionEquationId: "",
        editingEquationId: null
    };
}

export function saveState(state) {
    const payload = {
        currentScreen: state.currentScreen,
        topics: state.topics,
        equations: state.equations,
        restrictions: state.restrictions,
        bingoParams: state.bingoParams,
        generatedQuestions: state.generatedQuestions,
        generatedCards: state.generatedCards,
        cardDisplayMode: state.cardDisplayMode,
        visualTheme: state.visualTheme,
        customTopicCounter: state.customTopicCounter,
        customEquationCounter: state.customEquationCounter,
        questionCounter: state.questionCounter
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadSavedState() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Falha ao carregar estado salvo:", error);
        return null;
    }
}

export function mergeState(state, defaultTopics, defaultEquations) {
    const saved = loadSavedState();

    if (!saved) {
        state.topics = defaultTopics;
        state.equations = defaultEquations;
        return;
    }

    const mergedTopics = [];

    defaultTopics.forEach((topic) => {
        const savedTopic = (saved.topics || []).find((item) => item.id === topic.id);
        mergedTopics.push(savedTopic ? { ...savedTopic, ...topic, selected: savedTopic.selected ?? topic.selected } : topic);
    });

    (saved.topics || [])
        .filter((topic) => topic.source === "custom")
        .forEach((topic) => mergedTopics.push(topic));

    const mergedEquations = [];

    defaultEquations.forEach((equation) => {
        const savedEquation = (saved.equations || []).find((item) => item.id === equation.id);
        mergedEquations.push(savedEquation ? { ...savedEquation, ...equation, selected: savedEquation.selected ?? equation.selected } : equation);
    });

    (saved.equations || [])
        .filter((equation) => equation.source === "custom")
        .forEach((equation) => {
            if (!equation.formulaResposta) {
                equation.formulaResposta = equation.model || "";
            }
            if (!Array.isArray(equation.variables)) {
                equation.variables = [];
            }
            mergedEquations.push(equation);
        });

    state.topics = mergedTopics.filter((topic) => topic && topic.id && !isDuplicateById(topic.id, mergedTopics, topic));
    state.equations = mergedEquations.filter((equation) => equation && equation.id && !isDuplicateById(equation.id, mergedEquations, equation));
    state.restrictions = saved.restrictions || {};
    state.bingoParams = {
        ...state.bingoParams,
        numQuestoesUnicas: Number(saved.bingoParams?.numQuestoesUnicas ?? state.bingoParams.numQuestoesUnicas),
        numCartelas: Number(saved.bingoParams?.numCartelas ?? state.bingoParams.numCartelas),
        numQuestoesPorCartela: Number(saved.bingoParams?.numQuestoesPorCartela ?? state.bingoParams.numQuestoesPorCartela),
        minRepeticoes: Number(saved.bingoParams?.minRepeticoes ?? state.bingoParams.minRepeticoes),
        maxRepeticoes: Number(saved.bingoParams?.maxRepeticoes ?? state.bingoParams.maxRepeticoes)
    };
    state.generatedQuestions = Array.isArray(saved.generatedQuestions) ? saved.generatedQuestions : [];
    state.generatedCards = Array.isArray(saved.generatedCards) ? saved.generatedCards : [];
    state.cardDisplayMode = saved.cardDisplayMode === "aluno" ? "aluno" : "professor";
    state.visualTheme = {
        ...state.visualTheme,
        ...(saved.visualTheme || {})
    };
    state.currentScreen = saved.currentScreen || "inicio";
    state.customTopicCounter = Number(saved.customTopicCounter || 0);
    state.customEquationCounter = Number(saved.customEquationCounter || 0);
    state.questionCounter = Number(saved.questionCounter || state.generatedQuestions.length || 0);
}

function isDuplicateById(id, list, currentItem) {
    const first = list.find((item) => item.id === id);
    return first !== currentItem;
}
