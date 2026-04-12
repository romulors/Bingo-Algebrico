export class VisualTheme {
    constructor({
        nomeBingo = "BINGO ALGÉBRICO",
        nomeInstituicao = "",
        corPrimaria = "#03233e",
        corDestaque = "#64b0f2",
        corFundo = "#f3f4fa"
    } = {}) {
        this.nomeBingo = nomeBingo;
        this.nomeInstituicao = nomeInstituicao;
        this.corPrimaria = corPrimaria;
        this.corDestaque = corDestaque;
        this.corFundo = corFundo;
    }

    /**
     * Retorna um objeto de propriedades CSS customizadas correspondentes ao tema.
     * @returns {{ [cssVar: string]: string }}
     */
    toCSSVars() {
        return {
            "--colorDarkBlue":         this.corPrimaria,
            "--colorLightBlue":        this.corDestaque,
            "--colorQuasiWhite":       this.corFundo,
            "--bannerTopColor":        this.corPrimaria,
            "--bannerBottomColor":     this.corPrimaria,
            "--print-cor-primaria":    this.corPrimaria,
            "--print-cor-destaque":    this.corDestaque
        };
    }

    /** Aplica as variáveis CSS do tema diretamente no :root do documento. */
    applyCSSVars() {
        const root = document.documentElement;
        for (const [prop, value] of Object.entries(this.toCSSVars())) {
            root.style.setProperty(prop, value);
        }
    }

    /** Compara com outro VisualTheme ou objeto de mesma estrutura. */
    equals(other) {
        return (
            this.nomeBingo === other.nomeBingo &&
            this.nomeInstituicao === other.nomeInstituicao &&
            this.corPrimaria === other.corPrimaria &&
            this.corDestaque === other.corDestaque &&
            this.corFundo === other.corFundo
        );
    }
}
