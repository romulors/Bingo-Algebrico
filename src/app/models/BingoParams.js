export class BingoParams {
    constructor({
        numQuestoesUnicas = 20,
        numCartelas = 20,
        numQuestoesPorCartela = 6,
        minRepeticoes = 2,
        maxRepeticoes = 5
    } = {}) {
        this.numQuestoesUnicas = Number(numQuestoesUnicas);
        this.numCartelas = Number(numCartelas);
        this.numQuestoesPorCartela = Number(numQuestoesPorCartela);
        this.minRepeticoes = Number(minRepeticoes);
        this.maxRepeticoes = Number(maxRepeticoes);
    }

    /** Total de espaços a preencher nas cartelas. */
    get totalSlots() {
        return this.numCartelas * this.numQuestoesPorCartela;
    }

    /**
     * Valida a consistência dos parâmetros.
     * @param {number} equationCount — número de equações selecionadas.
     * @returns {string|null} Mensagem de erro, ou null se válido.
     */
    validate(equationCount) {
        const { numQuestoesUnicas, numCartelas, numQuestoesPorCartela, minRepeticoes, maxRepeticoes } = this;

        if (equationCount === 0) {
            return "Selecione ao menos uma equação antes de gerar questões.";
        }
        if (numQuestoesUnicas < 1 || numCartelas < 1 || numQuestoesPorCartela < 1) {
            return "Parâmetros numéricos devem ser maiores que zero.";
        }
        if (maxRepeticoes < minRepeticoes) {
            return "Máximo de repetições deve ser maior ou igual ao mínimo.";
        }
        if (numQuestoesPorCartela > numQuestoesUnicas) {
            return "Questões por cartela não pode ser maior que o número de questões únicas.";
        }
        if (minRepeticoes > numCartelas || maxRepeticoes > numCartelas) {
            return "Repetições por questão não pode ultrapassar o número de cartelas.";
        }

        const maxCoverage = numQuestoesUnicas * maxRepeticoes;
        const minCoverage = numQuestoesUnicas * minRepeticoes;

        if (this.totalSlots > maxCoverage) {
            return "Configuração inconsistente: faltam repetições para preencher todas as cartelas.";
        }
        if (this.totalSlots < minCoverage) {
            return "Configuração inconsistente: repetições mínimas estão altas para o total de espaços.";
        }

        return null;
    }
}
