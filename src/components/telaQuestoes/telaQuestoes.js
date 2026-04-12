import { renderMath } from "../../app/utils/ui.js";
import { MathUtils } from "../../app/services/math-utils.js";

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

        const cards = questions.map((question, index) => `
            <article class="questao-card">
                <div class="questao-card-header">
                    <span class="numero">#${String(index + 1).padStart(3, "0")}</span>
                    <span class="question-meta">${question.topicName} • ${question.equationName}</span>
                </div>
                <div class="question-equation">\\[${question.enunciado} = ${MathUtils.fractionToLatex(question.resposta)}\\]</div>
            </article>
        `);

        elements.questoesContainer.innerHTML = `<div class="questoes-grid">${cards.join("")}</div>`;

        renderMath(elements.questoesContainer);
    }

    function wireActions() {
        elements.botaoRegenerarQuestoes?.addEventListener("click", generateQuestions);
    }

    return { render, wireActions };
}
