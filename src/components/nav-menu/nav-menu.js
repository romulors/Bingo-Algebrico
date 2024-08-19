// Carrega o estilo associado a este componente
loadCSS("src/components/nav-menu/nav-menu.css");

const menuElements = document.querySelectorAll('.nav-menu-item');
const conteudoElements = document.querySelectorAll('.page-content');

iniciaSeletorAbas();

// Adiciona a funcionalidade de troca de abas
function iniciaSeletorAbas() {

	menuElements.forEach( (menu, index) => {
		menu.addEventListener('click', () => {
			
			// Remove a classe .active de todas opcoes de menu e de conteudo
			menuElements.forEach( opcaoDisponivel => opcaoDisponivel.classList.remove('active'));
			conteudoElements.forEach( conteudoDisponivel => conteudoDisponivel.classList.remove('active'));

			// Torna ativa a opcão do menu e seu respectivo conteudo
			menuElements[index].classList.add('active');
			conteudoElements[index].classList.add('active');
		})
	})
}