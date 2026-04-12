import { DEFAULT_DATA_FILES } from "./src/app/constants.js";
import { bindDOMElements as bindElements, createElementsRegistry } from "./src/app/dom-elements.js";
import { loadDefaultEquations } from "./src/app/services/data-loader.js";
import { createInitialState, mergeState as hydrateState, saveState as persistState, loadSavedState } from "./src/app/store.js";
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

function showToast(message) {
    _showToast(message);
    AppLogger.log("info", "toast", message);
}

function applyThemeVars(theme) {
    const root = document.documentElement;
    root.style.setProperty("--colorDarkBlue", theme.corPrimaria);
    root.style.setProperty("--colorLightBlue", theme.corDestaque);
    root.style.setProperty("--colorQuasiWhite", theme.corFundo);
    root.style.setProperty("--bannerTopColor", theme.corPrimaria);
    root.style.setProperty("--bannerBottomColor", theme.corPrimaria);
    root.style.setProperty("--print-cor-primaria", theme.corPrimaria);
    root.style.setProperty("--print-cor-destaque", theme.corDestaque);
}

// ─── Estado e registry de elementos ─────────────────────────────────────────────
const state = createInitialState();
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

// ─── Wrappers de dependências globais ───────────────────────────────────────────
function saveState() { persistState(state); }
function mergeState(defaultTopics, defaultEquations) { hydrateState(state, defaultTopics, defaultEquations); }
function showPersistentMessage(text, actionLabel, actionCallback) { showAppMessage(elements, text, actionLabel, actionCallback); }
function clearPersistentMessage() { clearAppMessage(elements); }
function navigateTo(screenName) { navMenu?.navigateTo(screenName); }
function getSelectedEquations() { return state.equations.filter((eq) => eq.selected); }

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
        telaTopicos = createTelaTopicos({ elements, state, renderAll, saveState, showToast, onManualConfigChange: markCustomPreset });
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
            onManualConfigChange: markCustomPreset
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

function getTelaPresets() {
    if (!telaPresets) {
        telaPresets = createTelaPresets({ elements, state, saveState, showToast, renderAll, navigateTo });
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
function renderAll() {
    getTelaInicio().render();
    getTelaTopicos().render();
    getTelaEquacoes().renderEquationTopicOptions();
    getTelaEquacoes().render();
    getTelaRestricoes().render();
    getTelaBingo().render();
    getTelaQuestoes().render();
    getTelaCartelas().render();
    getTelaVisual().render();
    getTelaPersistencia().render();
    getTelaLog().render();
    getTelaPresets().render();
    updateActionAvailability();
    updateNavStatuses();
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
        const _earlyTheme = loadSavedState()?.visualTheme;
        applyThemeVars({ ...createInitialState().visualTheme, ...(_earlyTheme || {}) });

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
            loadHTML("src/components/telaPresets/telaPresets.html", "[data-screen=\"presets\"]")
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
        mergeState(defaultTopics, defaultEquations);
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
