/**
 * BingoParams — creates the bingo parameters form widget with 5 linked inputs,
 * input-limit enforcement, and a status/validation message area.
 *
 * @param {object}   options
 * @param {object}   options.initialParams  — { numQuestoesUnicas, numCartelas, numQuestoesPorCartela, minRepeticoes, maxRepeticoes }
 * @param {function} [options.onChange]     — called with the current values object on any input change
 * @returns {{ element: HTMLElement, getValues: function, setValues: function, showStatus: function }}
 */
export function createBingoParams({ initialParams, onChange }) {
    const wrapper = document.createElement("div");
    wrapper.className = "bingo-params-widget";

    wrapper.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Parâmetro</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Número de questões únicas</td>
                        <td><input class="param-input" data-param="numQuestoesUnicas"
                            type="number" min="1" max="300" value="${initialParams.numQuestoesUnicas}"></td>
                        <td>Total de questões distintas geradas no banco do bingo.</td>
                    </tr>
                    <tr>
                        <td>Número de cartelas</td>
                        <td><input class="param-input" data-param="numCartelas"
                            type="number" min="1" max="200" value="${initialParams.numCartelas}"></td>
                        <td>Total de cartelas que serão montadas posteriormente.</td>
                    </tr>
                    <tr>
                        <td>Questões por cartela</td>
                        <td><input class="param-input" data-param="numQuestoesPorCartela"
                            type="number" min="1" max="25" value="${initialParams.numQuestoesPorCartela}"></td>
                        <td>Quantidade de questões exibidas em cada cartela.</td>
                    </tr>
                    <tr>
                        <td>Mínimo de repetições</td>
                        <td><input class="param-input" data-param="minRepeticoes"
                            type="number" min="1" max="50" value="${initialParams.minRepeticoes}"></td>
                        <td>Quantidade mínima que cada questão pode aparecer nas cartelas.</td>
                    </tr>
                    <tr>
                        <td>Máximo de repetições</td>
                        <td><input class="param-input" data-param="maxRepeticoes"
                            type="number" min="1" max="50" value="${initialParams.maxRepeticoes}"></td>
                        <td>Quantidade máxima que cada questão pode aparecer nas cartelas.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bingo-params-status section-description"></div>
    `;

    const statusEl = wrapper.querySelector(".bingo-params-status");

    function getInput(param) {
        return wrapper.querySelector(`[data-param="${param}"]`);
    }

    function getValues() {
        return {
            numQuestoesUnicas:     Number(getInput("numQuestoesUnicas").value),
            numCartelas:           Number(getInput("numCartelas").value),
            numQuestoesPorCartela: Number(getInput("numQuestoesPorCartela").value),
            minRepeticoes:         Number(getInput("minRepeticoes").value),
            maxRepeticoes:         Number(getInput("maxRepeticoes").value),
        };
    }

    function applyLimits() {
        const numQuestoesUnicas = Math.max(1, Number(getInput("numQuestoesUnicas").value));
        const numCartelas = Math.max(1, Number(getInput("numCartelas").value));
        const qpc = getInput("numQuestoesPorCartela");
        const minR = getInput("minRepeticoes");
        const maxR = getInput("maxRepeticoes");

        qpc.max = String(numQuestoesUnicas);
        minR.max = String(numCartelas);
        maxR.max = String(numCartelas);

        if (Number(qpc.value) > numQuestoesUnicas) qpc.value = String(numQuestoesUnicas);
        if (Number(minR.value) > numCartelas)       minR.value = String(numCartelas);
        if (Number(maxR.value) > numCartelas)       maxR.value = String(numCartelas);
    }

    function setValues(params) {
        Object.entries(params).forEach(([key, val]) => {
            const input = getInput(key);
            if (input) input.value = val;
        });
        applyLimits();
    }

    function showStatus(msg, isError) {
        statusEl.textContent = msg;
        statusEl.className = `bingo-params-status section-description ${isError ? "validation-error" : "validation-success"}`;
    }

    wrapper.querySelectorAll(".param-input").forEach((input) => {
        input.addEventListener("input", () => {
            applyLimits();
            onChange?.(getValues());
        });
    });

    applyLimits();

    return { element: wrapper, getValues, setValues, showStatus };
}
