export class RestrictionConfig {
    constructor({ min = 1, max = 10, tipo = "inteiro" } = {}) {
        this.min = Number(min);
        this.max = Number(max);
        this.tipo = tipo === "racional" ? "racional" : "inteiro";
    }

    /** Retorna os valores normalizados (garante min ≤ max). */
    getValue() {
        return {
            min: Math.min(this.min, this.max),
            max: Math.max(this.min, this.max),
            tipo: this.tipo
        };
    }
}
