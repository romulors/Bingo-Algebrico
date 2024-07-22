"use strict"

// Seleciona a tela dos topicos
const telaTopicos = document.querySelector(".conteudo.topicos")

// Cria um layout para inserir os tópicos
const layoutTopicos = document.createElement("div")
layoutTopicos.appendChild(document.createElement("div"))
layoutTopicos.appendChild(document.createElement("div"))
layoutTopicos.appendChild(document.createElement("div"))




layoutTopicos.classList.add("layout-topicos")
telaTopicos.appendChild(layoutTopicos)

const topicos = ["Frações","Expoentes","Trigonometria"]

console.log(telaTopicos)