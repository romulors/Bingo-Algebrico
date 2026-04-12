/**
 * FlowStepper — interactive step-progress component for the Início flow.
 * Manages its own activeIndex and re-renders itself when the user clicks a node.
 *
 * @param {object}   options
 * @param {Array}    options.steps               — FLOW_STEPS array ({ title, description, screen })
 * @param {Array}    options.statuses            — parallel array of { label, tone } objects
 * @param {number}   [options.defaultActiveIndex=0]
 * @param {function} options.onStepOpen          — called with screen name when "Abrir etapa" is clicked
 * @param {function} [options.onActiveIndexChange] — called with new index when user clicks a node
 * @returns {HTMLElement}
 */
export function createFlowStepper({ steps, statuses, defaultActiveIndex = 0, onStepOpen, onActiveIndexChange }) {
    let activeIndex = defaultActiveIndex;

    const container = document.createElement("div");

    function buildTrack() {
        return steps.map((step, index) => {
            const status = statuses[index];
            const isActive = index === activeIndex;
            const isDone = status.tone === "done";
            const connectorDone = index < steps.length - 1 && isDone && statuses[index + 1]?.tone === "done";

            const connector = index < steps.length - 1
                ? `<div class="stepper-connector${connectorDone ? " stepper-connector-done" : ""}"></div>`
                : "";

            return `
                <div class="stepper-node${isActive ? " active" : ""} stepper-tone-${status.tone}" data-index="${index}">
                    <div class="stepper-bubble">${String(index + 1).padStart(2, "0")}</div>
                    <span class="stepper-label">${step.title}</span>
                    <span class="stepper-status">${status.label}</span>
                </div>
                ${connector}
            `;
        }).join("");
    }

    function buildDetail() {
        const step = steps[activeIndex];
        const status = statuses[activeIndex];
        return `
            <div class="stepper-detail stepper-tone-${status.tone}">
                <p>${step.description}</p>
                <button class="botao botao-secundario stepper-open-btn" type="button" data-screen="${step.screen}">
                    Abrir etapa
                </button>
            </div>
        `;
    }

    function render() {
        container.innerHTML = `
            <div class="stepper-track">${buildTrack()}</div>
            ${buildDetail()}
        `;

        container.querySelectorAll(".stepper-node").forEach((node) => {
            node.addEventListener("click", () => {
                activeIndex = parseInt(node.dataset.index, 10);
                onActiveIndexChange?.(activeIndex);
                render();
            });
        });

        const openBtn = container.querySelector(".stepper-open-btn");
        openBtn?.addEventListener("click", () => onStepOpen?.(openBtn.dataset.screen));
    }

    render();
    return container;
}
