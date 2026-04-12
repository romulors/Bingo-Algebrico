import { TOAST_DURATION_MS } from "../constants.js";

export function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, TOAST_DURATION_MS);
}

export function showPersistentMessage(elements, text, actionLabel, actionCallback) {
    if (!elements.appMessage || !elements.appMessageText || !elements.appMessageAction) return;
    elements.appMessageText.textContent = text;
    if (actionLabel && actionCallback) {
        elements.appMessageAction.style.display = "inline-block";
        elements.appMessageAction.textContent = actionLabel;
        elements.appMessageAction.onclick = actionCallback;
    } else {
        elements.appMessageAction.style.display = "none";
        elements.appMessageAction.onclick = null;
    }
    elements.appMessage.style.display = "block";
}

export function clearPersistentMessage(elements) {
    if (!elements.appMessage || !elements.appMessageText || !elements.appMessageAction) return;
    elements.appMessage.style.display = "none";
    elements.appMessageText.textContent = "";
    elements.appMessageAction.onclick = null;
}

export function debounce(fn, wait) {
    let timeoutId = null;

    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
}

export function renderMath(target) {
    if (!target || !window.MathJax || !window.MathJax.typesetPromise) {
        return;
    }

    window.MathJax.typesetPromise([target]).catch((error) => console.warn(error));
}

/**
 * Carrega um fragmento HTML via fetch e injeta no elemento indicado.
 * @param {string} url        - Caminho do arquivo .html (relativo ao index.html).
 * @param {string|Element} target - Seletor CSS ou referência ao elemento de destino.
 */
export async function loadHTML(url, target) {
    const container = typeof target === "string" ? document.querySelector(target) : target;

    if (!container) {
        throw new Error(`loadHTML: elemento alvo não encontrado para "${target}"`);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`loadHTML: falha ao carregar "${url}" (HTTP ${response.status})`);
    }

    container.innerHTML = await response.text();
}
