/**
 * RestrictionTable — creates the variable-restriction form card for one equation.
 *
 * @param {object}   options
 * @param {object}   options.equation    — equation with .id, .name, .variables[]
 * @param {object}   options.restrictions — state.restrictions map (key → { min, max, tipo })
 * @param {boolean}  options.highlighted  — whether to apply the scroll-highlight style
 * @param {function} options.onChanged   — called with (key, field, rawValue) on input/select change
 * @returns {HTMLElement}
 */
export function createRestrictionTable({ equation, restrictions, highlighted, onChanged }) {
    const div = document.createElement("div");
    div.className = `restricao-card${highlighted ? " restriction-row-highlight" : ""}`;
    div.dataset.equationId = equation.id;

    const rows = equation.variables.map((varName) => {
        const key = `${equation.id}::${varName}`;
        const cfg = restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };

        return `
            <tr data-equation-id="${equation.id}">
                <td><strong>${varName}</strong></td>
                <td>
                    <input type="number" data-key="${key}" data-field="min"
                        value="${cfg.min}" min="-9999" max="9999">
                </td>
                <td>
                    <input type="number" data-key="${key}" data-field="max"
                        value="${cfg.max}" min="-9999" max="9999">
                </td>
                <td>
                    <select data-key="${key}" data-field="tipo">
                        <option value="inteiro"${cfg.tipo === "inteiro" ? " selected" : ""}>Inteiro</option>
                        <option value="racional"${cfg.tipo === "racional" ? " selected" : ""}>Racional</option>
                    </select>
                </td>
            </tr>
        `;
    }).join("");

    div.innerHTML = `
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
    `;

    div.querySelectorAll("input, select").forEach((el) => {
        el.addEventListener("change", (event) => {
            const { key, field } = event.target.dataset;
            if (!key || !field) return;
            onChanged?.(key, field, event.target.value);
        });
    });

    return div;
}
