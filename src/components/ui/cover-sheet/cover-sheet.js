/**
 * CoverSheet — creates the printable cover sheet for a bingo session.
 *
 * @param {object}   options
 * @param {object}   options.theme             — { nomeBingo, nomeInstituicao, corPrimaria, corDestaque }
 * @param {object}   options.params            — bingoParams object
 * @param {object[]} options.selectedTopics    — filtered topics array
 * @param {object[]} options.selectedEquations — filtered equations array
 * @returns {HTMLElement}
 */
export function createCoverSheet({ theme, params, selectedTopics, selectedEquations }) {
    const div = document.createElement("div");
    div.className = "cover-sheet";

    const eqByTopic = {};
    selectedEquations.forEach((eq) => {
        const topic = selectedTopics.find((t) => t.id === eq.topicId);
        const topicName = topic ? topic.name : "Sem tópico";
        if (!eqByTopic[topicName]) eqByTopic[topicName] = [];
        eqByTopic[topicName].push(eq.name);
    });

    const eqRows = Object.entries(eqByTopic).map(([topicName, eqNames]) =>
        eqNames.map((name, i) => `
            <tr>
                ${i === 0 ? `<td rowspan="${eqNames.length}" style="vertical-align:top;font-weight:600">${topicName}</td>` : ""}
                <td>${name}</td>
            </tr>
        `).join("")
    ).join("");

    div.innerHTML = `
        <div class="cover-header">
            <div class="cover-title">${theme.nomeBingo || "BINGO ALGÉBRICO"}</div>
            ${theme.nomeInstituicao ? `<div class="cover-subtitle">${theme.nomeInstituicao}</div>` : ""}
        </div>

        <div class="cover-section">
            <h4>Parâmetros do Bingo</h4>
            <table class="cover-table">
                <tr><td>Questões únicas</td><td>${params.numQuestoesUnicas}</td></tr>
                <tr><td>Número de cartelas</td><td>${params.numCartelas}</td></tr>
                <tr><td>Questões por cartela</td><td>${params.numQuestoesPorCartela}</td></tr>
                <tr><td>Mín. repetições</td><td>${params.minRepeticoes}</td></tr>
                <tr><td>Máx. repetições</td><td>${params.maxRepeticoes}</td></tr>
            </table>
        </div>

        <div class="cover-section">
            <h4>Tópicos e Equações Selecionadas</h4>
            <table class="cover-table">${eqRows}</table>
        </div>

        <div class="cover-section">
            <h4>Tema visual</h4>
            <table class="cover-table">
                <tr>
                    <td>Cor primária</td>
                    <td><span class="cover-swatch" style="background:${theme.corPrimaria}"></span> ${theme.corPrimaria}</td>
                </tr>
                <tr>
                    <td>Cor de destaque</td>
                    <td><span class="cover-swatch" style="background:${theme.corDestaque}"></span> ${theme.corDestaque}</td>
                </tr>
            </table>
        </div>
    `;

    return div;
}
