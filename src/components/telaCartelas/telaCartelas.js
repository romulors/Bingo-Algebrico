import { renderMath } from "../../app/utils/ui.js";
import { createCartelaCard } from "../ui/cartela-card/cartela-card.js";
import { createCoverSheet } from "../ui/cover-sheet/cover-sheet.js";

export function createTelaCartelas({ elements, state, saveState, showToast, navigateTo, renderAll, validateBingoParams, syncBingoParamsFromInputs, renderBingo }) {
    // ─── Helpers ─────────────────────────────────────────────────────────────────

    function isToggleOn(el) {
        return el?.dataset.checked === "true";
    }

    // ─── Utilitários de distribuição ─────────────────────────────────────────────

    function shuffleArray(array) {
        const list = [...array];

        for (let index = list.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [list[index], list[randomIndex]] = [list[randomIndex], list[index]];
        }

        return list;
    }

    function buildQuestionPool(questions, totalSlots, minRepeticoes, maxRepeticoes) {
        const pool = [];
        const usageCount = {};

        questions.forEach((question) => {
            usageCount[question.id] = 0;

            for (let repeat = 0; repeat < minRepeticoes; repeat += 1) {
                pool.push(question.id);
                usageCount[question.id] += 1;
            }
        });

        let safeGuard = 0;
        while (pool.length < totalSlots && safeGuard < 40000) {
            safeGuard += 1;
            const candidates = questions.filter((question) => usageCount[question.id] < maxRepeticoes);

            if (!candidates.length) break;

            const picked = candidates[Math.floor(Math.random() * candidates.length)];
            pool.push(picked.id);
            usageCount[picked.id] += 1;
        }

        return pool;
    }

    function createCardsFromPool(questionPool, numCartelas, numQuestoesPorCartela) {
        const shuffledPool = shuffleArray(questionPool);
        const cards = [];

        for (let cardIndex = 0; cardIndex < numCartelas; cardIndex += 1) {
            const questionsInCard = [];
            const usedInCard = new Set();
            let attempts = 0;

            while (questionsInCard.length < numQuestoesPorCartela && attempts < 3000) {
                attempts += 1;
                const pickedId = shuffledPool[Math.floor(Math.random() * shuffledPool.length)];

                if (!pickedId || usedInCard.has(pickedId)) continue;

                questionsInCard.push(pickedId);
                usedInCard.add(pickedId);
            }

            if (questionsInCard.length < numQuestoesPorCartela) {
                const fallback = shuffleArray(shuffledPool).filter((id) => !usedInCard.has(id));
                fallback.forEach((id) => {
                    if (questionsInCard.length < numQuestoesPorCartela) {
                        questionsInCard.push(id);
                    }
                });
            }

            cards.push({
                id: `cartela-${String(cardIndex + 1).padStart(3, "0")}`,
                questions: questionsInCard.slice(0, numQuestoesPorCartela)
            });
        }

        return cards;
    }

    // ─── Folha de rosto ──────────────────────────────────────────────────────────

    function buildCoverSheet() {
        if (!elements.folhaRostoImpressao) return;

        if (!isToggleOn(elements.toggleFolhaRosto)) {
            elements.folhaRostoImpressao.innerHTML = "";
            return;
        }

        const coverSheet = createCoverSheet({
            theme: state.visualTheme || {},
            params: state.bingoParams,
            selectedTopics: state.topics.filter((t) => t.selected),
            selectedEquations: state.equations.filter((eq) => eq.selected),
        });

        elements.folhaRostoImpressao.innerHTML = "";
        elements.folhaRostoImpressao.appendChild(coverSheet);
    }

    // ─── Render ──────────────────────────────────────────────────────────────────

    function render() {
        if (!elements.cartelasContainer || !elements.cartelasResumo) return;

        if (elements.botaoAlternarModoCartela) {
            elements.botaoAlternarModoCartela.textContent = `Modo Atual: ${state.cardDisplayMode === "professor" ? "Professor" : "Aluno"}`;
        }

        if (!state.generatedCards.length) {
            elements.cartelasResumo.textContent = "Nenhuma cartela gerada ainda.";
            elements.cartelasContainer.innerHTML = "<p class=\"empty-state\">Use o botão \"Gerar cartelas\" para montar as cartelas com base nas questões geradas.</p>";
            return;
        }

        const questionMap = new Map(state.generatedQuestions.map((question, index) => [question.id, { ...question, numero: index + 1 }]));
        elements.cartelasResumo.textContent = `Total de cartelas: ${state.generatedCards.length}. Visualização atual: ${state.cardDisplayMode}.`;

        const showHeader = isToggleOn(elements.toggleCabecalhoCartela);

        elements.cartelasContainer.innerHTML = "";
        state.generatedCards.forEach((card, index) => {
            const cardEl = createCartelaCard({
                card,
                cardIndex: index,
                questionMap,
                mode: state.cardDisplayMode,
                showHeader,
                theme: state.visualTheme,
            });
            elements.cartelasContainer.appendChild(cardEl);
        });

        buildCoverSheet();
        renderMath(elements.cartelasContainer);
    }

    // ─── Ações ───────────────────────────────────────────────────────────────────

    function generateCards() {
        const questions = state.generatedQuestions;

        if (!questions.length) {
            showToast("Gere questões antes de montar cartelas.");
            return;
        }

        syncBingoParamsFromInputs();
        const validationError = validateBingoParams();

        if (validationError) {
            showToast(validationError);
            renderBingo();
            return;
        }

        const { numCartelas, numQuestoesPorCartela, minRepeticoes, maxRepeticoes } = state.bingoParams;
        const totalSlots = numCartelas * numQuestoesPorCartela;

        if (questions.length * maxRepeticoes < totalSlots) {
            showToast(
                `Questões insuficientes: ${questions.length} geradas × ${maxRepeticoes} rep. máx. = ` +
                `${questions.length * maxRepeticoes} espaços, mas são necessários ${totalSlots}. ` +
                `Reduza cartelas, aumente repetições ou regenere as questões.`
            );
            return;
        }

        const questionPool = buildQuestionPool(questions, totalSlots, minRepeticoes, maxRepeticoes);

        if (questionPool.length < totalSlots) {
            showToast("Não foi possível preencher todas as cartelas com os limites atuais.");
            return;
        }

        state.generatedCards = createCardsFromPool(questionPool, numCartelas, numQuestoesPorCartela);
        saveState();
        renderAll();
        navigateTo("cartelas");
        showToast(`${state.generatedCards.length} cartelas geradas.`);
    }

    function toggleCardMode() {
        state.cardDisplayMode = state.cardDisplayMode === "professor" ? "aluno" : "professor";
        saveState();
        render();
    }

    function printCards() {
        if (!state.generatedCards.length) {
            showToast("Nenhuma cartela para imprimir.");
            return;
        }

        navigateTo("cartelas");
        const compact = isToggleOn(elements.toggleImpressaoCompacta);
        if (compact) document.body.classList.add("compact-print");
        window.print();
        if (compact) document.body.classList.remove("compact-print");
    }

    function wireActions() {
        elements.botaoGerarCartelas?.addEventListener("click", generateCards);
        elements.botaoAlternarModoCartela?.addEventListener("click", toggleCardMode);
        elements.botaoImprimirCartelas?.addEventListener("click", printCards);

        [elements.toggleCabecalhoCartela, elements.toggleFolhaRosto, elements.toggleImpressaoCompacta].forEach((btn) => {
            btn?.addEventListener("click", () => {
                const next = btn.dataset.checked !== "true";
                btn.dataset.checked = String(next);
                btn.setAttribute("aria-checked", String(next));
                render();
            });
        });
    }

    return { render, generateCards, toggleCardMode, printCards, wireActions };
}
