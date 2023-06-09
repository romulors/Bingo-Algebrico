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

		hrefs.forEach(ref => {

			fetch(ref)
			.then((response) => response.json())
			.then((json) => modelos.push(json));
		})

		//console.log(hrefs);
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