/**
 * StatusGrid — creates the five summary status cards for the Início screen.
 * Returns a DocumentFragment so items go directly into the container
 * (which already carries the .status-grid layout class).
 *
 * @param {object} options
 * @param {number} options.selectedTopics
 * @param {number} options.selectedEquations
 * @param {number} options.restrictedVars
 * @param {number} options.generatedQuestions
 * @param {number} options.generatedCards
 * @returns {DocumentFragment}
 */
export function createStatusGrid({ selectedTopics, selectedEquations, restrictedVars, generatedQuestions, generatedCards }) {
    const fragment = document.createDocumentFragment();

    const items = [
        { label: "Tópicos selecionados",   value: selectedTopics },
        { label: "Equações selecionadas",  value: selectedEquations },
        { label: "Variáveis com restrição", value: restrictedVars },
        { label: "Questões geradas",        value: generatedQuestions },
        { label: "Cartelas geradas",        value: generatedCards },
    ];

    items.forEach(({ label, value }) => {
        const card = document.createElement("div");
        card.className = "status-card";
        card.innerHTML = `
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        `;
        fragment.appendChild(card);
    });

    return fragment;
}
