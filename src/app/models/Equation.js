export class Equation {
    constructor({ id, topicId, name, model, responseModel, formulaResposta, variables = [], selected = false, source = "default" }) {
        this.id = id;
        this.topicId = topicId;
        this.name = name;
        this.model = model;
        this.responseModel = responseModel;
        this.formulaResposta = formulaResposta;
        this.variables = Array.isArray(variables) ? variables : [];
        this.selected = selected;
        this.source = source;
    }

    /** Retorna a chave usada em state.restrictions para uma variável desta equação. */
    getRestrictionKey(variableName) {
        return `${this.id}::${variableName}`;
    }
}
