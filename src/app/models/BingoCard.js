export class BingoCard {
    constructor({ id, questions = [] }) {
        this.id = id;
        this.questions = questions; // array de IDs de Question
    }
}
