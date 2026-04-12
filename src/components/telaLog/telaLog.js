import { AppLogger } from "../../app/logger.js";

const LEVEL_LABELS = {
    info:   "Info",
    action: "Ação",
    warn:   "Aviso",
    error:  "Erro"
};

const LEVEL_COLORS = {
    info:   "#6c757d",
    action: "#1971c2",
    warn:   "#e67700",
    error:  "#c92a2a"
};

export function createTelaLog({ elements }) {
    function renderTable() {
        if (!elements.logContainer) return;

        const logs = AppLogger.getLogs();

        if (!logs.length) {
            elements.logContainer.innerHTML = "<p class=\"empty-state\">Nenhum evento registrado ainda.</p>";
            return;
        }

        const rows = logs.map((entry) => {
            const color = LEVEL_COLORS[entry.level] || LEVEL_COLORS.info;
            const label = LEVEL_LABELS[entry.level] || entry.level;
            return `
                <tr>
                    <td style="color:${color};font-weight:700;white-space:nowrap;">${label}</td>
                    <td style="white-space:nowrap;color:#888;">${entry.timestamp}</td>
                    <td><span class="badge">${entry.category}</span></td>
                    <td>${entry.message}</td>
                </tr>
            `;
        }).join("");

        elements.logContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nível</th>
                        <th>Hora</th>
                        <th>Categoria</th>
                        <th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    function render() {
        renderTable();
    }

    function wireActions() {
        elements.botaoLimparLog?.addEventListener("click", () => {
            AppLogger.clear();
            renderTable();
        });

        AppLogger.subscribe(() => {
            if (elements.logContainer) renderTable();
        });
    }

    return { render, wireActions };
}
