import { MathUtils } from "../../../app/services/math-utils.js";

/**
 * QuestaoCard — creates an article element showing one generated question.
 *
 * @param {object} options
 * @param {object} options.question  — { topicName, equationName, enunciado, resposta }
 * @param {number} options.index     — zero-based index for display numbering
 * @returns {HTMLElement}
 */
export function createQuestaoCard({ question, index }) {
    const card = document.createElement("article");
    card.className = "questao-card";

    card.innerHTML = `
        <div class="questao-card-header">
            <span class="numero">#${String(index + 1).padStart(3, "0")}</span>
            <span class="question-meta">${question.topicName} • ${question.equationName}</span>
        </div>
        <div class="question-equation">\\[${question.enunciado} = ${MathUtils.fractionToLatex(question.resposta)}\\]</div>
    `;

    return card;
}
