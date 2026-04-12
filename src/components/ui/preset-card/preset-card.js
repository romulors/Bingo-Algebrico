/**
 * PresetCard — creates an article element representing one preset configuration.
 *
 * @param {object}   options
 * @param {object}   options.preset      — preset data { id, title, description, icon, customSelection }
 * @param {boolean}  options.isSelected  — whether this preset is currently active
 * @param {string[]} options.topicNames  — names of the topics covered by this preset
 * @param {function} options.onClick     — called when the card is clicked
 * @returns {HTMLElement}
 */
export function createPresetCard({ preset, isSelected, topicNames, onClick }) {
    const card = document.createElement("article");
    card.className = `presetCard${isSelected ? " selected" : ""}`;

    const badges = topicNames.map((name) => `<span class="badge">${name}</span>`).join("");
    const actionLabel = preset.customSelection ? "Selecionar" : "Aplicar";

    card.innerHTML = `
        <div class="presetIcon"><i class="fas ${preset.icon}"></i></div>
        <span class="presetTitle">${preset.title}</span>
        <p class="presetDescription">${preset.description}</p>
        <div class="presetFooter">
            <div class="presetTags">${badges}</div>
            <span class="presetAction">${actionLabel} <i class="fas fa-arrow-right"></i></span>
        </div>
    `;

    card.addEventListener("click", () => onClick?.());
    return card;
}
