import { MathUtils } from "../services/math-utils.js";

export class Question {
    constructor({ id, equationId, equationName, topicId, topicName, valores, enunciado, resposta }) {
        this.id = id;
        this.equationId = equationId;
        this.equationName = equationName;
        this.topicId = topicId;
        this.topicName = topicName;
        this.valores = valores;
        this.enunciado = enunciado;
        this.resposta = resposta;
    }

    /**
     * Retorna a expressão LaTeX para exibição na cartela.
     * @param {"professor"|"aluno"} mode
     * @returns {string}
     */
    getLatex(mode = "professor") {
        if (mode === "professor") {
            return `${this.enunciado} = ${MathUtils.fractionToLatex(this.resposta)}`;
        }
        return `${this.enunciado} = \\square`;
    }
}
