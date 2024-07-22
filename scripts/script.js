"use strict"
const body = document.getElementsByTagName('body')[0];
const scriptList = [];

//Scripts que serão carregados
scriptList.push("scripts/telas/sideMenu.js");
scriptList.push("scripts/telas/telaInicio.js");
scriptList.push("scripts/telas/telaTopicos.js");
scriptList.push("scripts/telas/telaEquacoes.js");
scriptList.push("scripts/telas/telaRestricoes.js");
scriptList.push("scripts/telas/telaBingo.js");
scriptList.push("scripts/telas/telaQuestoes.js");
scriptList.push("scripts/telas/telaCartelas.js");
scriptList.push("scripts/telas/telaFinal.js");

loadAllScripts(scriptList);

function loadAllScripts(listOfScripts) 
{
	listOfScripts.forEach(loadScript);
}

function loadScript(url)
{
    var script = document.createElement('script');
    script.src = url;
    body.appendChild(script);
}