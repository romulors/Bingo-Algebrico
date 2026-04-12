export class Topic {
    constructor({ id, name, selected = false, source = "default" }) {
        this.id = id;
        this.name = name;
        this.selected = selected;
        this.source = source;
    }
}
