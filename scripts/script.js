"use strict"
const head = document.getElementsByTagName('head')[0];
const body = document.getElementsByTagName('body')[0];
const scriptList = [];
const cssList = [];

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

//Styles que serão carregados

loadAllScripts(scriptList);
loadAllCSSs(cssList);

function loadAllScripts(listOfScripts) 
{
	listOfScripts.forEach(loadScript);
}

function loadScript(url)
{
    const script = document.createElement('script');
    // style.type = "text/javascript";
    script.src = url;
    body.appendChild(script);
}

function loadAllCSSs(listOfCSSs) 
{
	listOfScripts.forEach(loadScript);
}

function loadCSS(url)
{
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = url;
    head.appendChild(style);
}