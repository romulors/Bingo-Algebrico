export const MathUtils = {
    gcd(a, b) {
        let x = Math.abs(a);
        let y = Math.abs(b);

        while (y !== 0) {
            const temp = y;
            y = x % y;
            x = temp;
        }

        return x || 1;
    },

    simplifyFraction(numerator, denominator) {
        if (denominator === 0) {
            return "Indefinido";
        }

        const divisor = this.gcd(numerator, denominator);
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;

        if (simplifiedDenominator === 1) {
            return `${simplifiedNumerator}`;
        }

        return `${simplifiedNumerator}/${simplifiedDenominator}`;
    },

    evaluateFormula(formula, values) {
        if (!formula || !String(formula).trim()) return "Erro";
        try {
            const result = math.evaluate(formula, values);

            if (result === undefined || result === null) return "Erro";

            if (typeof result === "number") {
                if (Number.isInteger(result)) {
                    return String(result);
                }

                const tolerance = 1e-10;
                const denominatorLimit = 1000;

                for (let denominator = 1; denominator <= denominatorLimit; denominator += 1) {
                    const numerator = result * denominator;

                    if (Math.abs(numerator - Math.round(numerator)) < tolerance) {
                        return this.simplifyFraction(Math.round(numerator), denominator);
                    }
                }

                return result.toFixed(2).replace(".", ",");
            }

            return String(result);
        } catch (error) {
            console.error("Erro ao avaliar fórmula:", error);
            return "Erro";
        }
    },

    fractionToLatex(value) {
        if (value === undefined || value === null || value === "" || value === "undefined" || value === "Erro") return "?";
        const str = String(value).trim();
        const match = str.match(/^(-?)(\d+)\/(\d+)$/);
        if (!match) return str;
        const sign = match[1];
        const num = match[2];
        const den = match[3];
        return `${sign}\\frac{${num}}{${den}}`;
    }
};
