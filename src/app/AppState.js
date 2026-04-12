import { STORAGE_KEY, DEFAULT_VISUAL_THEME } from "./constants.js";
import { BingoParams } from "./models/BingoParams.js";
import { VisualTheme } from "./models/VisualTheme.js";

// ─── Nomes de eventos emitidos pelo AppState ──────────────────────────────────
export const APP_EVENTS = Object.freeze({
    TOPICS_CHANGED:      "topics-changed",
    EQUATIONS_CHANGED:   "equations-changed",
    RESTRICTIONS_CHANGED:"restrictions-changed",
    BINGO_PARAMS_CHANGED:"bingo-params-changed",
    QUESTIONS_CHANGED:   "questions-changed",
    CARDS_CHANGED:       "cards-changed",
    THEME_CHANGED:       "theme-changed",
    SCREEN_CHANGED:      "screen-changed",
    STATE_LOADED:        "state-loaded"
});

// ─── AppState ─────────────────────────────────────────────────────────────────
/**
 * Estado central da aplicação com suporte a events (EventTarget).
 * Componentes subscrevem eventos específicos em vez de chamar renderAll().
 *
 * Uso:
 *   const appState = new AppState();
 *   appState.addEventListener(APP_EVENTS.TOPICS_CHANGED, () => telaTopicos.render());
 *   appState.setTopics([...]);  // dispara "topics-changed"
 */
export class AppState extends EventTarget {
    constructor() {
        super();

        // Dados principais
        this.topics               = [];
        this.equations            = [];
        this.restrictions         = {}; // chave: `${equationId}::${varName}`
        this.bingoParams          = new BingoParams();
        this.generatedQuestions   = [];
        this.generatedCards       = [];

        // UI / preferências
        this.currentScreen              = "inicio";
        this.cardDisplayMode            = "professor";
        this.visualTheme                = new VisualTheme(DEFAULT_VISUAL_THEME);
        this.activePresetId             = "customizado";
        this.focusedRestrictionEquationId = "";
        this.editingEquationId          = null;

        // Contadores internos para IDs únicos customizados
        this.customTopicCounter      = 0;
        this.customEquationCounter   = 0;
        this.questionCounter         = 0;
    }

    // ─── Helpers de emissão ───────────────────────────────────────────────────

    _emit(eventName) {
        this.dispatchEvent(new CustomEvent(eventName));
    }

    // ─── Setters que emitem eventos ───────────────────────────────────────────

    setTopics(topics) {
        this.topics = topics;
        this._emit(APP_EVENTS.TOPICS_CHANGED);
    }

    setEquations(equations) {
        this.equations = equations;
        this._emit(APP_EVENTS.EQUATIONS_CHANGED);
    }

    setRestrictions(restrictions) {
        this.restrictions = restrictions;
        this._emit(APP_EVENTS.RESTRICTIONS_CHANGED);
    }

    setRestriction(key, config) {
        this.restrictions[key] = config;
        this._emit(APP_EVENTS.RESTRICTIONS_CHANGED);
    }

    deleteRestriction(key) {
        delete this.restrictions[key];
        this._emit(APP_EVENTS.RESTRICTIONS_CHANGED);
    }

    setBingoParams(params) {
        this.bingoParams = params instanceof BingoParams ? params : new BingoParams(params);
        this._emit(APP_EVENTS.BINGO_PARAMS_CHANGED);
    }

    setGeneratedQuestions(questions) {
        this.generatedQuestions = questions;
        this._emit(APP_EVENTS.QUESTIONS_CHANGED);
    }

    setGeneratedCards(cards) {
        this.generatedCards = cards;
        this._emit(APP_EVENTS.CARDS_CHANGED);
    }

    setVisualTheme(theme) {
        this.visualTheme = theme instanceof VisualTheme ? theme : new VisualTheme(theme);
        this._emit(APP_EVENTS.THEME_CHANGED);
    }

    setCurrentScreen(screen) {
        this.currentScreen = screen;
        this._emit(APP_EVENTS.SCREEN_CHANGED);
    }

    // ─── Persistência ─────────────────────────────────────────────────────────

    save() {
        const payload = {
            currentScreen:         this.currentScreen,
            topics:                this.topics,
            equations:             this.equations,
            restrictions:          this.restrictions,
            bingoParams:           { ...this.bingoParams },
            generatedQuestions:    this.generatedQuestions,
            generatedCards:        this.generatedCards,
            cardDisplayMode:       this.cardDisplayMode,
            visualTheme:           { ...this.visualTheme },
            customTopicCounter:    this.customTopicCounter,
            customEquationCounter: this.customEquationCounter,
            questionCounter:       this.questionCounter,
            activePresetId:        this.activePresetId ?? "customizado"
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    static loadRaw() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            console.warn("AppState: falha ao carregar estado salvo.");
            return null;
        }
    }

    /**
     * Mescla dados padrão com o estado persistido no localStorage.
     * Equivalente a mergeState() do store.js legado.
     */
    merge(defaultTopics, defaultEquations) {
        const saved = AppState.loadRaw();

        if (!saved) {
            this.topics    = defaultTopics;
            this.equations = defaultEquations;
            this._emit(APP_EVENTS.STATE_LOADED);
            return;
        }

        // ── Tópicos ──────────────────────────────────────────────────────────
        const mergedTopics = [];

        defaultTopics.forEach((topic) => {
            const savedTopic = (saved.topics || []).find((item) => item.id === topic.id);
            mergedTopics.push(
                savedTopic
                    ? { ...savedTopic, ...topic, selected: savedTopic.selected ?? topic.selected }
                    : topic
            );
        });

        (saved.topics || [])
            .filter((topic) => topic.source === "custom")
            .forEach((topic) => mergedTopics.push(topic));

        // ── Equações ─────────────────────────────────────────────────────────
        const mergedEquations = [];

        defaultEquations.forEach((equation) => {
            const savedEquation = (saved.equations || []).find((item) => item.id === equation.id);
            mergedEquations.push(
                savedEquation
                    ? { ...savedEquation, ...equation, selected: savedEquation.selected ?? equation.selected }
                    : equation
            );
        });

        (saved.equations || [])
            .filter((equation) => equation.source === "custom")
            .forEach((equation) => {
                if (!equation.formulaResposta) equation.formulaResposta = equation.model || "";
                if (!Array.isArray(equation.variables)) equation.variables = [];
                mergedEquations.push(equation);
            });

        const _isDuplicate = (id, list, current) => list.find((item) => item.id === id) !== current;

        this.topics     = mergedTopics.filter((t) => t && t.id && !_isDuplicate(t.id, mergedTopics, t));
        this.equations  = mergedEquations.filter((e) => e && e.id && !_isDuplicate(e.id, mergedEquations, e));
        this.restrictions = saved.restrictions || {};

        this.bingoParams = new BingoParams({
            numQuestoesUnicas:      Number(saved.bingoParams?.numQuestoesUnicas    ?? this.bingoParams.numQuestoesUnicas),
            numCartelas:            Number(saved.bingoParams?.numCartelas           ?? this.bingoParams.numCartelas),
            numQuestoesPorCartela:  Number(saved.bingoParams?.numQuestoesPorCartela ?? this.bingoParams.numQuestoesPorCartela),
            minRepeticoes:          Number(saved.bingoParams?.minRepeticoes         ?? this.bingoParams.minRepeticoes),
            maxRepeticoes:          Number(saved.bingoParams?.maxRepeticoes         ?? this.bingoParams.maxRepeticoes)
        });

        this.generatedQuestions = Array.isArray(saved.generatedQuestions) ? saved.generatedQuestions : [];
        this.generatedCards     = Array.isArray(saved.generatedCards)     ? saved.generatedCards     : [];
        this.cardDisplayMode    = saved.cardDisplayMode === "aluno" ? "aluno" : "professor";
        this.visualTheme        = new VisualTheme({ ...DEFAULT_VISUAL_THEME, ...(saved.visualTheme || {}) });
        this.currentScreen      = saved.currentScreen || "inicio";
        this.customTopicCounter    = Number(saved.customTopicCounter    || 0);
        this.customEquationCounter = Number(saved.customEquationCounter || 0);
        this.questionCounter       = Number(saved.questionCounter       || this.generatedQuestions.length || 0);
        this.activePresetId        = typeof saved.activePresetId === "string" ? saved.activePresetId : "customizado";

        this._emit(APP_EVENTS.STATE_LOADED);
    }
}
