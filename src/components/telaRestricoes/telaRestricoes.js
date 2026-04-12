export function createTelaRestricoes({ elements, state, saveState, onRestricaoChanged }) {
    function render() {
        if (!elements.restricoesContainer) return;

        const selectedEquations = state.equations.filter((equation) => equation.selected);

        if (selectedEquations.length === 0) {
            elements.restricoesContainer.innerHTML = "<p class=\"empty-state\">Selecione equações para configurar restrições por variável.</p>";
            return;
        }

        const cards = selectedEquations.map((equation) => {
            const cardClass = state.focusedRestrictionEquationId === equation.id ? "restricao-card restriction-row-highlight" : "restricao-card";

            const rows = equation.variables.map((variableName) => {
                const key = `${equation.id}::${variableName}`;
                const config = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };

                return `
                    <tr data-equation-id="${equation.id}">
                        <td><strong>${variableName}</strong></td>
                        <td>
                            <input type="number" data-key="${key}" data-field="min" value="${config.min}" min="-9999" max="9999">
                        </td>
                        <td>
                            <input type="number" data-key="${key}" data-field="max" value="${config.max}" min="-9999" max="9999">
                        </td>
                        <td>
                            <select data-key="${key}" data-field="tipo">
                                <option value="inteiro" ${config.tipo === "inteiro" ? "selected" : ""}>Inteiro</option>
                                <option value="racional" ${config.tipo === "racional" ? "selected" : ""}>Racional</option>
                            </select>
                        </td>
                    </tr>
                `;
            }).join("");

            return `
                <div class="${cardClass}">
                    <h4 class="restricao-card-title">${equation.name}</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Variável</th>
                                <th>Mín</th>
                                <th>Máx</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        });

        elements.restricoesContainer.innerHTML = `<div class="restricoes-grid">${cards.join("")}</div>`;

        elements.restricoesContainer
            .querySelectorAll("input, select")
            .forEach((inputElement) => {
                inputElement.addEventListener("change", _onRestricaoChange);
            });
    }

    function _onRestricaoChange(event) {
        const inputElement = event.target;
        const key = inputElement.dataset.key;
        const field = inputElement.dataset.field;

        if (!key || !field) return;

        const current = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };

        if (field === "min" || field === "max") {
            current[field] = Number(inputElement.value);
        } else {
            current[field] = inputElement.value;
        }

        state.restrictions[key] = current;
        saveState();

        if (typeof onRestricaoChanged === "function") {
            onRestricaoChanged();
        }
    }

    function wireActions(showToast) {
        elements.botaoSalvarRestricoes?.addEventListener("click", () => {
            saveState();
            showToast("Restrições salvas.");
        });
    }

    return { render, wireActions };
}
