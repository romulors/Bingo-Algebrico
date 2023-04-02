const menuElements = document.querySelectorAll('.menuItem');
const conteudoElements = document.querySelectorAll('.conteudo');

// Cria variaveis globais
let modelos = [];

// Inicia a configuração da página
iniciaSeletorAbas();
carregaModelosEquacoes();

console.log(modelos);

// Carrega arquivos de modelos padrões da pagina
// modeloSomaFracoes = fetch('./modelos/fracoes_soma.json')
// .then((response) => response.json())
// .then((json) => console.log(json));


// Carrega todos os modelos padrões da página
async function carregaModelosEquacoes() {
	try {
		const diretorio = "modelos/";
		const hrefs = await verificaModelosEquacoes(diretorio);

		// hrefs = [];
		// hrefs.push("./modelos/fracoes_divisao.json");
		// hrefs.push("./modelos/fracoes_multiplicacao.json");
		// hrefs.push("./modelos/fracoes_soma.json");
		// hrefs.push("./modelos/fracoes_subtracao.json");

		hrefs.forEach(ref => {
			fetch(ref)
			.then((response) => response.json())
			.then((json) => modelos.push(json));
		})

	} catch (err) {
		console.log(err);
	}
 }

// Verifica quais modelos existem no diretório modelos
async function verificaModelosEquacoes(diretorio) {
	try {
		const response = await fetch(diretorio);
		const html = await response.text();
		const div = document.createElement('div');
		div.innerHTML = html;
		const anchorTags = div.querySelectorAll('a.icon-application-json');
		const hrefs = [];
		anchorTags.forEach(tag => {
			hrefs.push(tag.href);
		});
		return hrefs;
	} catch (err) {
		console.log('Falha em verificar arquivos do diretório modelos', err);
		return [];
	}
}


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

