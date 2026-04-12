/**
 * Utilitários de ação reutilizáveis — eliminam padrões repetidos nos componentes.
 */

/**
 * Salva o estado e exibe um toast de confirmação.
 * Elimina o padrão `saveState(); showToast("X salvos.")` repetido em vários componentes.
 *
 * @param {() => void} saveFn  - Função de persistência (ex: saveState).
 * @param {(msg: string) => void} toastFn - Função de notificação (ex: showToast).
 * @param {string} message     - Mensagem a exibir.
 */
export function saveAndNotify(saveFn, toastFn, message) {
    saveFn();
    toastFn(message);
}

/**
 * Exibe um confirm() e executa fn somente se o usuário confirmar.
 * Elimina o padrão `const ok = confirm(...); if (!ok) return; fn()`.
 *
 * @param {string} message  - Mensagem de confirmação.
 * @param {() => void} fn   - Callback executado se confirmado.
 */
export function confirmAndRun(message, fn) {
    if (window.confirm(message)) fn();
}

/**
 * Constrói a chave usada em state.restrictions para uma variável de uma equação.
 * Centraliza o padrão `${equationId}::${variableName}` que ocorre em múltiplos arquivos.
 *
 * @param {string} equationId
 * @param {string} variableName
 * @returns {string}
 */
export function makeRestrictionKey(equationId, variableName) {
    return `${equationId}::${variableName}`;
}
