import { DEFAULT_DATA_FILES, DEFAULT_VISUAL_THEME } from "./src/app/constants.js";
import { getSelectedEquations as _storeGetSelectedEquations } from "./src/app/store.js";
import { bindDOMElements as bindElements, createElementsRegistry } from "./src/app/dom-elements.js";
import { loadDefaultEquations } from "./src/app/services/data-loader.js";
import { AppState } from "./src/app/AppState.js";
import { VisualTheme } from "./src/app/models/VisualTheme.js";
import { clearPersistentMessage as clearAppMessage, loadHTML, showPersistentMessage as showAppMessage, showToast as _showToast } from "./src/app/utils/ui.js";
import { AppLogger } from "./src/app/logger.js";
import { createNavMenu, parseHash } from "./src/components/nav-menu/nav-menu.js";
import { createTelaInicio } from "./src/components/telaInicio/telaInicio.js";
import { createTelaTopicos } from "./src/components/telaTopicos/telaTopicos.js";
import { createTelaEquacoes } from "./src/components/telaEquacoes/telaEquacoes.js";
import { createTelaRestricoes } from "./src/components/telaRestricoes/telaRestricoes.js";
import { createTelaBingo } from "./src/components/telaBingo/telaBingo.js";
import { createTelaQuestoes } from "./src/components/telaQuestoes/telaQuestoes.js";
import { createTelaCartelas } from "./src/components/telaCartelas/telaCartelas.js";
import { createTelaVisual } from "./src/components/telaVisual/telaVisual.js";
import { createTelaPersistencia } from "./src/components/telaPersistencia/telaPersistencia.js";
import { createTelaLog } from "./src/components/telaLog/telaLog.js";
import { createTelaPresets } from "./src/components/telaPresets/telaPresets.js";
import { createTelaSobre } from "./src/components/telaSobre/telaSobre.js";

function showToast(message) {
    _showToast(message);
    AppLogger.log("info", "toast", message);
}

function applyThemeVars(theme) {
    new VisualTheme(theme).applyCSSVars();
}

// ─── Estado e registry de elementos ─────────────────────────────────────────────
const state = new AppState();
const elements = createElementsRegistry();

// ─── Instâncias dos componentes (lazy) ──────────────────────────────────────────
let navMenu = null;
let telaInicio = null;
let telaTopicos = null;
let telaEquacoes = null;
let telaRestricoes = null;
let telaBingo = null;
let telaQuestoes = null;
let telaCartelas = null;
let telaVisual = null;
let telaPersistencia = null;
let telaLog = null;
let telaPresets = null;
let telaSobre = null;

// ─── Wrappers de dependências globais ───────────────────────────────────────────
function saveState() { state.save(); }
function showPersistentMessage(text, actionLabel, actionCallback) { showAppMessage(elements, text, actionLabel, actionCallback); }
function clearPersistentMessage() { clearAppMessage(elements); }
function navigateTo(screenName) { navMenu?.navigateTo(screenName); }
function getSelectedEquations() { return _storeGetSelectedEquations(state); }

// ─── Agendador de idle (graceful degradation para Safari) ────────────────────────
const scheduleIdle = typeof window !== "undefined" && window.requestIdleCallback
    ? (fn) => window.requestIdleCallback(fn)
    : (fn) => setTimeout(fn, 0);

// ─── Getters lazy dos componentes ───────────────────────────────────────────────
function getTelaInicio() {
    if (!telaInicio) {
        telaInicio = createTelaInicio({
            elements,
            state,
            navigateTo,
            getSelectedEquations,
            validateBingoParams: () => getTelaBingo().validateBingoParams()
        });
    }
    return telaInicio;
}

function markCustomPreset() {
    if (telaPresets) getTelaPresets().selectCustom();
}

function getTelaTopicos() {
    if (!telaTopicos) {
        telaTopicos = createTelaTopicos({ elements, state, renderAll, saveState, showToast, onManualConfigChange: markCustomPreset, onTopicToggle: renderAfterTopicToggle });
    }
    return telaTopicos;
}

function getTelaEquacoes() {
    if (!telaEquacoes) {
        telaEquacoes = createTelaEquacoes({
            elements,
            state,
            renderAll,
            saveState,
            showToast,
            navigateTo,
            onFocusRestricoes: () => getTelaRestricoes().render(),
            onManualConfigChange: markCustomPreset,
            onEquationToggle: renderAfterEquationToggle
        });
    }
    return telaEquacoes;
}

function getTelaRestricoes() {
    if (!telaRestricoes) {
        telaRestricoes = createTelaRestricoes({
            elements,
            state,
            saveState,
            onRestricaoChanged: () => {
                getTelaInicio().render();
                updateNavStatuses();
            }
        });
    }
    return telaRestricoes;
}

function getTelaBingo() {
    if (!telaBingo) {
        telaBingo = createTelaBingo({
            elements,
            state,
            saveState,
            showToast,
            getSelectedEquations,
            navigateTo,
            renderAll,
            onManualConfigChange: markCustomPreset,
            onBingoParamChange: () => { getTelaInicio().render(); updateNavStatuses(); }
        });
    }
    return telaBingo;
}

function getTelaQuestoes() {
    if (!telaQuestoes) {
        telaQuestoes = createTelaQuestoes({
            elements,
            state,
            generateQuestions: () => getTelaBingo().generateQuestions()
        });
    }
    return telaQuestoes;
}

function getTelaCartelas() {
    if (!telaCartelas) {
        telaCartelas = createTelaCartelas({
            elements,
            state,
            saveState,
            showToast,
            navigateTo,
            renderAll,
            validateBingoParams: () => getTelaBingo().validateBingoParams(),
            syncBingoParamsFromInputs: () => getTelaBingo().syncBingoParamsFromInputs(),
            renderBingo: () => getTelaBingo().render()
        });
    }
    return telaCartelas;
}

function getTelaVisual() {
    if (!telaVisual) {
        telaVisual = createTelaVisual({ elements, state, saveState, showToast, navigateTo, renderAll, applyThemeVars });
    }
    return telaVisual;
}

function getTelaPersistencia() {
    if (!telaPersistencia) {
        telaPersistencia = createTelaPersistencia({ elements, state, saveState, showToast, renderAll, applyThemeVars, getTelaPresets });
    }
    return telaPersistencia;
}

function getTelaLog() {
    if (!telaLog) {
        telaLog = createTelaLog({ elements });
    }
    return telaLog;
}

function getTelaSobre() {
    if (!telaSobre) {
        telaSobre = createTelaSobre();
    }
    return telaSobre;
}

function getTelaPresets() {
    if (!telaPresets) {
        telaPresets = createTelaPresets({ elements, state, saveState, showToast, renderAll });
    }
    return telaPresets;
}

// ─── Status do workflow no nav-menu ──────────────────────────────────────────────
function navStatusIcon(tone) {
    if (tone === "done") return '<i class="fas fa-check"></i>';
    if (tone === "in-progress") return '<i class="fas fa-circle-half-stroke"></i>';
    if (tone === "warning") return '<i class="fas fa-triangle-exclamation"></i>';
    if (tone === "pending") return '<i class="fas fa-minus"></i>';
    return "";
}

function updateNavStatuses() {
    if (!telaInicio) return;
    const statuses = getTelaInicio().getStepStatuses();
    statuses.forEach(({ screen, tone }) => {
        const item = elements.navItems?.find((el) => el.dataset.target === screen);
        const span = item?.querySelector(".nav-status");
        if (span) {
            span.className = `nav-status nav-status-${tone}`;
            span.innerHTML = navStatusIcon(tone);
        }
    });
}

// ─── Disponibilidade de ações ────────────────────────────────────────────────────
function updateActionAvailability() {
    const selectedTopics = state.topics.filter((t) => t.selected).length;
    const selectedEquations = state.equations.filter((eq) => eq.selected).length;
    const hasQuestions = state.generatedQuestions.length > 0;
    const hasCards = state.generatedCards.length > 0;
    const bingoValidationError = getTelaBingo().validateBingoParams();

    if (elements.botaoAdicionarEquacao) {
        elements.botaoAdicionarEquacao.disabled = selectedTopics === 0;
    }
    if (elements.botaoGerarQuestoes) {
        elements.botaoGerarQuestoes.disabled = selectedEquations === 0 || Boolean(bingoValidationError);
    }
    if (elements.botaoRegenerarQuestoes) {
        elements.botaoRegenerarQuestoes.disabled = selectedEquations === 0;
    }
    if (elements.botaoGerarCartelas) {
        elements.botaoGerarCartelas.disabled = !hasQuestions;
    }
    if (elements.botaoAlternarModoCartela) {
        elements.botaoAlternarModoCartela.disabled = !hasCards;
    }
    if (elements.botaoImprimirCartelas) {
        elements.botaoImprimirCartelas.disabled = !hasCards;
    }
}

// ─── Render global ───────────────────────────────────────────────────────────────
// ─── Mapa de tela → função de render ─────────────────────────────────────────────
function renderScreen(screenName) {
    switch (screenName) {
        case "inicio":      getTelaInicio().render(); break;
        case "topicos":     getTelaTopicos().render(); break;
        case "equacoes":    getTelaEquacoes().renderEquationTopicOptions(); getTelaEquacoes().render(); break;
        case "restricoes":  getTelaRestricoes().render(); break;
        case "bingo":       getTelaBingo().render(); break;
        case "questoes":    getTelaQuestoes().render(); break;
        case "cartelas":    getTelaCartelas().render(); break;
        case "visual":      getTelaVisual().render(); break;
        case "persistencia":getTelaPersistencia().render(); break;
        case "log":         getTelaLog().render(); break;
        case "presets":     getTelaPresets().render(); break;
        case "sobre":       getTelaSobre().render(); break;
        default: break;
    }
}

// ─── Render atômico: toggle de tópico ────────────────────────────────────────────
function renderAfterTopicToggle(topicId) {
    // Tier A — síncrono: patch imediato no card clicado
    const topic = state.topics.find((t) => t.id === topicId);
    if (topic) getTelaTopicos().patchCardSelection(topicId, topic.selected);

    // Tier B — próximo frame: telas dependentes de seleção de tópico
    requestAnimationFrame(() => {
        getTelaEquacoes().renderEquationTopicOptions();
        getTelaEquacoes().render();
        getTelaRestricoes().render();
        getTelaBingo().render();
        getTelaInicio().render();
        updateActionAvailability();
        updateNavStatuses();
    });

    // Tier C — ocioso: telas independentes da seleção
    scheduleIdle(() => {
        getTelaPersistencia().render();
        getTelaPresets().render();
    });
}

// ─── Render atômico: toggle de equação ───────────────────────────────────────────
function renderAfterEquationToggle(equationId) {
    // Tier A — síncrono: patch imediato no card clicado
    const equation = state.equations.find((eq) => eq.id === equationId);
    if (equation) getTelaEquacoes().patchCardSelection(equationId, equation.selected);

    // Tier B — próximo frame: telas dependentes de seleção de equação
    requestAnimationFrame(() => {
        getTelaRestricoes().render();
        getTelaBingo().render();
        getTelaInicio().render();
        updateActionAvailability();
        updateNavStatuses();
    });

    // Tier C — ocioso: telas independentes da seleção
    scheduleIdle(() => {
        getTelaPersistencia().render();
    });
}

// ─── Render global (mudanças estruturais: adicionar/remover/importar/preset) ──────
function renderAll() {
    // Tela atual primeiro para feedback imediato
    renderScreen(state.currentScreen);

    scheduleIdle(() => {
        const allScreens = ["inicio", "topicos", "equacoes", "restricoes", "bingo",
            "questoes", "cartelas", "visual", "persistencia", "log", "presets", "sobre"];
        allScreens
            .filter((s) => s !== state.currentScreen)
            .forEach((s) => renderScreen(s));
        updateActionAvailability();
        updateNavStatuses();
    });
}

// ─── Setup de navegação ──────────────────────────────────────────────────────────
function setupNavigation() {
    if (!navMenu) {
        navMenu = createNavMenu({
            elements,
            state,
            saveState,
            onCartelasModeChange: (mode) => {
                state.cardDisplayMode = mode === "aluno" ? "aluno" : "professor";
                getTelaCartelas().render();
            }
        });
    }
    navMenu.setup();
}

// ─── Wiring de todas as ações ─────────────────────────────────────────────────────
function wireActions() {
    // Tópicos
    elements.botaoAdicionarNovoTopico?.addEventListener("click", () => getTelaTopicos().addTopic());
    elements.inputNovoTopicoNome?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") { event.preventDefault(); getTelaTopicos().addTopic(); }
    });
    elements.botaoSalvarTopicos?.addEventListener("click", () => { saveState(); showToast("Tópicos salvos."); });

    // Equações — formulário e listagem
    getTelaEquacoes().wireFormActions();

    // Restrições
    getTelaRestricoes().wireActions(showToast);

    // Bingo
    getTelaBingo().wireActions();

    // Questões
    getTelaQuestoes().wireActions();

    // Cartelas
    getTelaCartelas().wireActions();

    // Visual
    getTelaVisual().wireActions();

    // Persistência
    getTelaPersistencia().wireActions();

    // Log
    getTelaLog().wireActions();

    // Navegação sequencial entre telas
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".botao-nav-next");
        if (btn?.dataset.next) navigateTo(btn.dataset.next);
    });
}

// ─── Inicialização ────────────────────────────────────────────────────────────────
async function initialize() {
    try {
        // 0. Aplicar tema salvo imediatamente, antes de qualquer render
        const _earlyTheme = AppState.loadRaw()?.visualTheme;
        applyThemeVars({ ...DEFAULT_VISUAL_THEME, ...(_earlyTheme || {}) });

        // 1. Carregar todos os fragmentos HTML em paralelo antes de qualquer bind
        await Promise.all([
            loadHTML("src/components/nav-menu/nav-menu.html",       "#nav-menu"),
            loadHTML("src/components/telaInicio/telaInicio.html",   "[data-screen=\"inicio\"]"),
            loadHTML("src/components/telaTopicos/telaTopicos.html", "[data-screen=\"topicos\"]"),
            loadHTML("src/components/telaEquacoes/telaEquacoes.html",   "[data-screen=\"equacoes\"]"),
            loadHTML("src/components/telaRestricoes/telaRestricoes.html", "[data-screen=\"restricoes\"]"),
            loadHTML("src/components/telaBingo/telaBingo.html",     "[data-screen=\"bingo\"]"),
            loadHTML("src/components/telaQuestoes/telaQuestoes.html", "[data-screen=\"questoes\"]"),
            loadHTML("src/components/telaCartelas/telaCartelas.html", "[data-screen=\"cartelas\"]"),
            loadHTML("src/components/telaVisual/telaVisual.html",     "[data-screen=\"visual\"]"),
            loadHTML("src/components/telaPersistencia/telaPersistencia.html", "[data-screen=\"persistencia\"]"),
            loadHTML("src/components/telaLog/telaLog.html", "[data-screen=\"log\"]"),
            loadHTML("src/components/telaPresets/telaPresets.html", "[data-screen=\"presets\"]"),
            loadHTML("src/components/telaSobre/telaSobre.html", "[data-screen=\"sobre\"]")
        ]);

        // 2. Agora todos os elementos existem no DOM — fazer o bind
        bindElements(elements);

        // 3. Carregar dados padrão
        const loaded = await loadDefaultEquations();

        if (!loaded || loaded.length < DEFAULT_DATA_FILES.length) {
            showPersistentMessage(
                "Alguns dados iniciais falharam ao carregar.",
                "Tentar novamente",
                () => { clearPersistentMessage(); initialize(); }
            );
        } else {
            clearPersistentMessage();
        }

        const defaultTopics = [];
        const defaultEquations = [];
        const usedTopicIds = new Set();

        loaded.forEach((item) => {
            if (!usedTopicIds.has(item.topic.id)) {
                usedTopicIds.add(item.topic.id);
                defaultTopics.push(item.topic);
            }
            defaultEquations.push(item.equation);
        });

        // 4. Hidratar estado, aplicar tema, montar navegação e eventos
        state.merge(defaultTopics, defaultEquations);
        applyThemeVars(state.visualTheme);
        setupNavigation();
        wireActions();
        renderAll();

        // 5. Deep-link via hash
        const { screen, params } = parseHash(location.hash);
        const target = screen || "inicio";
        navigateTo(target);

        if (params.mode && target === "cartelas") {
            state.cardDisplayMode = params.mode;
            getTelaCartelas().render();
        }

        showToast("Aplicação inicializada.");
    } catch (error) {
        console.error(error);
        AppLogger.log("error", "global", `Erro de inicialização: ${error.message}`);
        showToast("Erro ao carregar dados iniciais.");
    }
}

window.addEventListener("error", (event) => {
    AppLogger.log("error", "global", event.message || "Erro não tratado");
});
window.addEventListener("unhandledrejection", (event) => {
    AppLogger.log("error", "global", `Promise rejeitada: ${event.reason}`);
});

initialize();
