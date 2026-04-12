import { createRestrictionTable } from "../ui/restriction-table/restriction-table.js";
import { RestrictionConfig } from "../../app/models/RestrictionConfig.js";

export function createTelaRestricoes({ elements, state, saveState, onRestricaoChanged }) {
    function render() {
        if (!elements.restricoesContainer) return;

        const selectedEquations = state.equations.filter((equation) => equation.selected);

        if (selectedEquations.length === 0) {
            elements.restricoesContainer.innerHTML = "<p class=\"empty-state\">Selecione equações para configurar restrições por variável.</p>";
            return;
        }

        let newEntriesAdded = false;
        selectedEquations.forEach((equation) => {
            equation.variables.forEach((variableName) => {
                const key = `${equation.id}::${variableName}`;
                if (!state.restrictions[key]) {
                    state.restrictions[key] = new RestrictionConfig().getValue();
                    newEntriesAdded = true;
                }
            });
        });
        if (newEntriesAdded) {
            saveState();
            onRestricaoChanged?.();
        }

        const grid = document.createElement("div");
        grid.className = "restricoes-grid";

        selectedEquations.forEach((equation) => {
            const table = createRestrictionTable({
                equation,
                restrictions: state.restrictions,
                highlighted: state.focusedRestrictionEquationId === equation.id,
                onChanged: (key, field, rawValue) => {
                    const current = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };
                    if (field === "min" || field === "max") {
                        current[field] = Number(rawValue);
                    } else {
                        current[field] = rawValue;
                    }
                    state.restrictions[key] = current;
                    saveState();
                    onRestricaoChanged?.();
                },
            });
            grid.appendChild(table);
        });

        elements.restricoesContainer.innerHTML = "";
        elements.restricoesContainer.appendChild(grid);
    }

    function wireActions(showToast) {
        elements.botaoSalvarRestricoes?.addEventListener("click", () => {
            saveState();
            showToast("Restrições salvas.");
        });
    }

    return { render, wireActions };
}
