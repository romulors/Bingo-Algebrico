"use strict"
const head = document.getElementsByTagName('head')[0];
const body = document.getElementsByTagName('body')[0];
const scriptList = [];
const cssList = [];

//Scripts que serão carregados
scriptList.push("src/components/nav-menu/nav-menu.js");
scriptList.push("src/components/telaBingo/telaBingo.js");
scriptList.push("src/components/telaCartelas/telaCartelas.js");
scriptList.push("src/components/telaEquacoes/telaEquacoes.js");
scriptList.push("src/components/telaFinal/telaFinal.js");
scriptList.push("src/components/telaInicio/telaInicio.js");
scriptList.push("src/components/telaQuestoes/telaQuestoes.js");
scriptList.push("src/components/telaRestricoes/telaRestricoes.js");
scriptList.push("src/components/telaTopicos/telaTopicos.js");

//Styles que serão carregados
// cssList.push("styles/telaTopicos.css");

loadAllScripts(scriptList);
// loadAllCSSs(cssList);

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
    
    console.log("Carregando script: " + url);
}

function loadAllCSSs(listOfCSSs) 
{
	listOfCSSs.forEach(loadCSS);
}

function loadCSS(url)
{
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = url;
    head.appendChild(style);

    console.log("Carregando estilo: " + url);
}