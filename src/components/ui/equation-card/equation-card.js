/**
 * EquationCard — creates an article element representing one equation.
 *
 * @param {object}   options
 * @param {object}   options.equation              — equation data object
 * @param {string}   options.topicName             — display name of the parent topic
 * @param {function} options.onToggle              — called when card body is clicked
 * @param {function} options.onEdit                — called with equation.id to open edit form
 * @param {function} options.onDelete              — called with equation.id to remove
 * @param {function} options.onOpenRestrictions    — called with equation.id to open restrictions
 * @returns {HTMLElement}
 */
export function createEquationCard({ equation, topicName, onToggle, onEdit, onDelete, onOpenRestrictions }) {
    const card = document.createElement("article");
    card.className = `equationCard${equation.selected ? " selected" : ""}`;
    card.dataset.equationId = equation.id;

    card.innerHTML = `
        <span class="renderEquation">\\(${equation.model} = ${equation.responseModel}\\)</span>
        <span class="equationName">${equation.name}</span>
        <div class="equationFooter">
            <span class="badge">${topicName}</span>
            <span class="equationStatus">${equation.selected ? "Adicionada" : "Não adicionada"}</span>
            <span class="equationActions">
                <span class="icon-btn primary editEquationRestrictionsButton" title="Editar definição da equação"><i class="fas fa-wrench"></i></span>
                <span class="icon-btn danger deleteEquationButton" title="Remover equação"><i class="fas fa-xmark"></i></span>
            </span>
        </div>
        <div class="equationLinkRow">
            <button class="text-link-button viewRestrictionsLink" type="button">Abrir restrições</button>
        </div>
    `;

    card.addEventListener("click", () => onToggle?.());

    card.querySelector(".editEquationRestrictionsButton").addEventListener("click", (e) => {
        e.stopPropagation();
        onEdit?.(equation.id);
    });

    card.querySelector(".deleteEquationButton").addEventListener("click", (e) => {
        e.stopPropagation();
        onDelete?.(equation.id);
    });

    card.querySelector(".viewRestrictionsLink").addEventListener("click", (e) => {
        e.stopPropagation();
        onOpenRestrictions?.(equation.id);
    });

    return card;
}
