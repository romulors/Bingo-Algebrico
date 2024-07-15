const menuElements = document.querySelectorAll('.menuItem');
const conteudoElements = document.querySelectorAll('.conteudo');

const equacoes = document.querySelectorAll('.conteudo.equacoes table');
console.log(equacoes);

// Cria variaveis globais
let modelos = [];

// Inicia a configuração da página
iniciaSeletorAbas();


carregaModelosHardcoded();
//monta lista de tópicos
//monta lista de equações
//monta lista de restrições







console.log(modelos);

function carregaModelosHardcoded() {

	let topico = new Topico("Soma de Frações");
	let equacao = new Equacao("Soma de duas frações", "A/B + C/D", "E/F");
	let variavelA = new Variavel("A");
	let variavelB = new Variavel("B");
	let variavelC = new Variavel("C");
	let variavelD = new Variavel("D");
	let variavelE = new Variavel("E");
	let variavelF = new Variavel("F");

	let restricaoA1 = new Restricao("Número diferente de zero");
	let restricaoA2 = new Restricao("Número inteiro");
	let restricaoA3 = new Restricao("Valor Mínimo: 1");
	let restricaoA4 = new Restricao("Valor Máximo: 99");

	let restricaoB1 = new Restricao("Número diferente de zero");
	let restricaoB2 = new Restricao("Número inteiro");

	let restricaoC1 = new Restricao("Número diferente de zero");
	let restricaoC2 = new Restricao("Número inteiro");

	let restricaoD1 = new Restricao("Número diferente de zero");
	let restricaoD2 = new Restricao("Número inteiro");

	let restricaoE1 = new Restricao("Número diferente de zero");
	let restricaoE2 = new Restricao("Número inteiro");

	let restricaoF1 = new Restricao("Número diferente de zero");
	let restricaoF2 = new Restricao("Número inteiro");

	let restricaoEquacao = new Restricao("E/F simplifica");


	const modeloSoma = new Equacao(  
		"Frações",
		"Soma de Frações",
		"Equação de Soma",
		"A/B + C/D",
		"E/F");

	const modeloSubtracao = new Equacao(
		"Frações",
		"Subtração de Frações",
		"Equação de Subtração",
		"A/B - C/D",
		"E/F"
	);
	const modeloMultiplicacao = new Equacao(
		"Frações",
		"Multiplicação de Frações",
		"Equação de Multiplicação",
		"A/B + C/D",
		"E/F"
	);
	const modeloDivisao = new Equacao(
		"Frações",
		"Divisão de Frações",
		"Equação de Divisão",
		"A/B / C/D",
		"E/F"
	);

	modelos.push(modeloSoma);
	modelos.push(modeloSubtracao);
	modelos.push(modeloMultiplicacao);
	modelos.push(modeloDivisao);
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

