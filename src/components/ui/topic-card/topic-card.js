/**
 * TopicCard — creates an article element representing one topic.
 *
 * @param {object}   options
 * @param {object}   options.topic          — { id, name, selected }
 * @param {number}   options.equationCount  — total equations in this topic
 * @param {function} options.onToggle       — called when the card body is clicked
 * @param {function} options.onEdit         — called with topic.id when edit button is clicked
 * @param {function} options.onRemove       — called with topic.id when remove button is clicked
 * @returns {HTMLElement}
 */
export function createTopicCard({ topic, equationCount, onToggle, onEdit, onRemove }) {
    const card = document.createElement("article");
    card.className = `topicCard${topic.selected ? " selected" : ""}`;
    card.dataset.topicId = topic.id;

    card.innerHTML = `
        <span class="topicName">${topic.name}</span>
        <span class="topicNumberOfQuestions">${equationCount} Equações</span>
        <div class="topicFooter">
            <span class="icon-btn success editTopicButton" title="Editar tópico"><i class="fas fa-wrench"></i></span>
            <span class="topicStatus">${topic.selected ? "Adicionado" : "Não adicionado"}</span>
            <span class="icon-btn danger deleteTopicButton" title="Remover tópico"><i class="fas fa-xmark"></i></span>
        </div>
    `;

    card.addEventListener("click", () => onToggle?.());

    card.querySelector(".editTopicButton").addEventListener("click", (e) => {
        e.stopPropagation();
        onEdit?.(topic.id);
    });

    card.querySelector(".deleteTopicButton").addEventListener("click", (e) => {
        e.stopPropagation();
        onRemove?.(topic.id);
    });

    return card;
}
