import { MathUtils } from "../../../app/services/math-utils.js";

/**
 * CartelaCard — creates an article element showing one bingo card.
 *
 * @param {object}  options
 * @param {object}  options.card        — { id, questions: string[] } (question IDs)
 * @param {number}  options.cardIndex   — zero-based index for display numbering
 * @param {Map}     options.questionMap — Map<questionId, { ...question, numero: number }>
 * @param {string}  options.mode        — "professor" (shows answer) or "aluno" (shows □)
 * @param {boolean} options.showHeader  — whether to include the print header row
 * @param {object}  options.theme       — { nomeBingo, nomeInstituicao }
 * @returns {HTMLElement}
 */
export function createCartelaCard({ card, cardIndex, questionMap, mode, showHeader, theme }) {
    const article = document.createElement("article");
    article.className = "cartela-card";

    const nomeBingo = theme?.nomeBingo || "BINGO ALGÉBRICO";
    const nomeInstituicao = theme?.nomeInstituicao || "";

    const items = card.questions.map((questionId) => {
        const question = questionMap.get(questionId);
        if (!question) return "";

        const expression = mode === "professor"
            ? `${question.enunciado} = ${MathUtils.fractionToLatex(question.resposta)}`
            : `${question.enunciado} = \\square`;

        return `
            <div class="cartela-item">
                <span class="numero">Questão #${String(question.numero).padStart(3, "0")}</span>
                <div class="question-equation">\\[${expression}\\]</div>
            </div>
        `;
    }).join("");

    const headerHtml = showHeader ? `
        <div class="cartela-header-print">
            <span>${nomeBingo}</span>
            ${nomeInstituicao ? `<span>${nomeInstituicao}</span>` : "<span></span>"}
            <span>Cartela #${String(cardIndex + 1).padStart(3, "0")}</span>
        </div>
    ` : "";

    article.innerHTML = `
        ${headerHtml}
        <h3>Cartela #${String(cardIndex + 1).padStart(3, "0")}</h3>
        <div class="cartela-lista">${items}</div>
    `;

    return article;
}
