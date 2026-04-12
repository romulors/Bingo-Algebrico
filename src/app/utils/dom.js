/**
 * Cria um registry de elementos DOM a partir de um mapa { nomeLocal: idNoHTML }.
 * Substitui o padrão de 130 linhas de createElementsRegistry() + bindDOMElements().
 *
 * @param {{ [key: string]: string }} idMap - Mapa de nome lógico → id do elemento HTML.
 * @returns {{ [key: string]: HTMLElement|null }}
 *
 * @example
 *   const el = bindElements({ topicsList: "topicsList", botaoSalvar: "botaoSalvarTopicos" });
 *   el.topicsList.innerHTML = "...";
 */
export function bindElements(idMap) {
    return Object.fromEntries(
        Object.entries(idMap).map(([key, id]) => [key, document.getElementById(id)])
    );
}
