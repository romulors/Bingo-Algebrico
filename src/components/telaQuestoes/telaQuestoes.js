import { renderMath } from "../../app/utils/ui.js";
import { createQuestaoCard } from "../ui/questao-card/questao-card.js";

export function createTelaQuestoes({ elements, state, generateQuestions }) {
    let lastRenderedQuestions = null;

    function render() {
        if (!elements.questoesContainer || !elements.questoesResumo) return;

        const questions = state.generatedQuestions;

        if (!questions.length) {
            if (lastRenderedQuestions !== questions) {
                lastRenderedQuestions = questions;
                elements.questoesResumo.textContent = "Nenhuma questão gerada ainda.";
                elements.questoesContainer.innerHTML = "<p class=\"empty-state\">Use a tela Bingo para gerar questões automaticamente.</p>";
            }
            return;
        }

        if (lastRenderedQuestions === questions) return;
        lastRenderedQuestions = questions;

        const distribution = {};
        questions.forEach((question) => {
            distribution[question.equationName] = (distribution[question.equationName] || 0) + 1;
        });

        elements.questoesResumo.textContent = `Total gerado: ${questions.length} questões. ${Object.keys(distribution).length} tipo(s).`;

        const grid = document.createElement("div");
        grid.className = "questoes-grid";
        questions.forEach((question, index) => {
            grid.appendChild(createQuestaoCard({ question, index }));
        });

        elements.questoesContainer.innerHTML = "";
        elements.questoesContainer.appendChild(grid);
        renderMath(elements.questoesContainer);
    }

    function wireActions() {
        elements.botaoRegenerarQuestoes?.addEventListener("click", generateQuestions);
    }

    return { render, wireActions };
}
