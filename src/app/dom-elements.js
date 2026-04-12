export function createElementsRegistry() {
    return {
        navMenu: null,
        navItems: null,
        screens: null,
        inicioStatus: null,
        inicioFlow: null,
        botaoIrTopicos: null,
        botaoIrPresets: null,
        topicsList: null,
        inputNovoTopicoNome: null,
        botaoAdicionarNovoTopico: null,
        botaoSalvarTopicos: null,
        equationsList: null,
        inputNovaEquacaoTopico: null,
        inputNovaEquacaoNome: null,
        inputNovaEquacaoModelo: null,
        inputNovaEquacaoResposta: null,
        inputNovaEquacaoFormula: null,
        botaoAdicionarEquacao: null,
        botaoMostrarFormEquacao: null,
        equacaoFormPanel: null,
        equacaoPreview: null,
        equacaoPreviewMath: null,
        botaoSalvarEquacoes: null,
        restricoesContainer: null,
        botaoSalvarRestricoes: null,
        paramNumQuestoesUnicas: null,
        paramNumCartelas: null,
        paramNumQuestoesPorCartela: null,
        paramMinRepeticoes: null,
        paramMaxRepeticoes: null,
        bingoValidationMessage: null,
        botaoSalvarParametrosBingo: null,
        botaoGerarQuestoes: null,
        questoesResumo: null,
        questoesContainer: null,
        botaoRegenerarQuestoes: null,
        cartelasResumo: null,
        cartelasContainer: null,
        botaoGerarCartelas: null,
        botaoAlternarModoCartela: null,
        botaoImprimirCartelas: null,
        checkboxImpressaoCompacta: null,
        checkboxCabecalhoCartela: null,
        checkboxFolhaRosto: null,
        folhaRostoImpressao: null,
        presetsContainer: null,
        temaNomeBingo: null,
        temaNomeInstituicao: null,
        temaCorPrimaria: null,
        temaCorDestaque: null,
        temaCorFundo: null,
        visualResumo: null,
        botaoAplicarTema: null,
        botaoExportarConfiguracao: null,
        botaoImportarConfiguracao: null,
        inputImportarConfiguracao: null,
        botaoExportarDados: null,
        botaoImportarDados: null,
        inputImportarDados: null,
        inputNomeExportacao: null,
        importExportFeedback: null,
        botaoLimparLog: null,
        logContainer: null,
        appMessage: null,
        appMessageText: null,
        appMessageAction: null
    };
}

export function bindDOMElements(elements) {
    elements.navMenu = document.getElementById("nav-menu");
    elements.navItems = Array.from(document.querySelectorAll(".nav-menu-item"));
    elements.screens = Array.from(document.querySelectorAll(".page-content"));
    elements.inicioStatus = document.getElementById("inicioStatus");
    elements.inicioFlow = document.getElementById("inicioFlow");
    elements.botaoIrTopicos = document.getElementById("botaoIrTopicos");
    elements.botaoIrPresets = document.getElementById("botaoIrPresets");
    elements.topicsList = document.getElementById("topicsList");
    elements.inputNovoTopicoNome = document.getElementById("inputNovoTopicoNome");
    elements.botaoAdicionarNovoTopico = document.getElementById("botaoAdicionarNovoTopico");
    elements.botaoSalvarTopicos = document.getElementById("botaoSalvarTopicos");
    elements.equationsList = document.getElementById("equationsList");
    elements.inputNovaEquacaoTopico = document.getElementById("inputNovaEquacaoTopico");
    elements.inputNovaEquacaoNome = document.getElementById("inputNovaEquacaoNome");
    elements.inputNovaEquacaoModelo = document.getElementById("inputNovaEquacaoModelo");
    elements.inputNovaEquacaoResposta = document.getElementById("inputNovaEquacaoResposta");
    elements.inputNovaEquacaoFormula = document.getElementById("inputNovaEquacaoFormula");
    elements.botaoAdicionarEquacao = document.getElementById("botaoAdicionarEquacao");
    elements.botaoMostrarFormEquacao = document.getElementById("botaoMostrarFormEquacao");
    elements.equacaoFormPanel = document.getElementById("equacaoFormPanel");
    elements.equacaoPreview = document.getElementById("equacaoPreview");
    elements.equacaoPreviewMath = document.getElementById("equacaoPreviewMath");
    elements.botaoSalvarEquacoes = document.getElementById("botaoSalvarEquacoes");
    elements.restricoesContainer = document.getElementById("restricoesContainer");
    elements.botaoSalvarRestricoes = document.getElementById("botaoSalvarRestricoes");
    elements.paramNumQuestoesUnicas = document.getElementById("paramNumQuestoesUnicas");
    elements.paramNumCartelas = document.getElementById("paramNumCartelas");
    elements.paramNumQuestoesPorCartela = document.getElementById("paramNumQuestoesPorCartela");
    elements.paramMinRepeticoes = document.getElementById("paramMinRepeticoes");
    elements.paramMaxRepeticoes = document.getElementById("paramMaxRepeticoes");
    elements.bingoValidationMessage = document.getElementById("bingoValidationMessage");
    elements.botaoSalvarParametrosBingo = document.getElementById("botaoSalvarParametrosBingo");
    elements.botaoGerarQuestoes = document.getElementById("botaoGerarQuestoes");
    elements.questoesResumo = document.getElementById("questoesResumo");
    elements.questoesContainer = document.getElementById("questoesContainer");
    elements.botaoRegenerarQuestoes = document.getElementById("botaoRegenerarQuestoes");
    elements.cartelasResumo = document.getElementById("cartelasResumo");
    elements.cartelasContainer = document.getElementById("cartelasContainer");
    elements.botaoGerarCartelas = document.getElementById("botaoGerarCartelas");
    elements.botaoAlternarModoCartela = document.getElementById("botaoAlternarModoCartela");
    elements.botaoImprimirCartelas = document.getElementById("botaoImprimirCartelas");
    elements.checkboxImpressaoCompacta = document.getElementById("checkboxImpressaoCompacta");
    elements.checkboxFolhaRosto = document.getElementById("checkboxFolhaRosto");
    elements.checkboxCabecalhoCartela = document.getElementById("checkboxCabecalhoCartela");
    elements.folhaRostoImpressao = document.getElementById("folhaRostoImpressao");
    elements.presetsContainer = document.getElementById("presetsContainer");
    elements.temaNomeBingo = document.getElementById("temaNomeBingo");
    elements.temaNomeInstituicao = document.getElementById("temaNomeInstituicao");
    elements.temaCorPrimaria = document.getElementById("temaCorPrimaria");
    elements.temaCorDestaque = document.getElementById("temaCorDestaque");
    elements.temaCorFundo = document.getElementById("temaCorFundo");
    elements.visualResumo = document.getElementById("visualResumo");
    elements.botaoAplicarTema = document.getElementById("botaoAplicarTema");
    elements.botaoExportarConfiguracao = document.getElementById("botaoExportarConfiguracao");
    elements.botaoImportarConfiguracao = document.getElementById("botaoImportarConfiguracao");
    elements.inputImportarConfiguracao = document.getElementById("inputImportarConfiguracao");
    elements.botaoExportarDados = document.getElementById("botaoExportarDados");
    elements.botaoImportarDados = document.getElementById("botaoImportarDados");
    elements.inputImportarDados = document.getElementById("inputImportarDados");
    elements.inputNomeExportacao = document.getElementById("inputNomeExportacao");
    elements.importExportFeedback = document.getElementById("importExportFeedback");
    elements.botaoLimparLog = document.getElementById("botaoLimparLog");
    elements.logContainer = document.getElementById("logContainer");
    elements.appMessage = document.getElementById("appMessage");
    elements.appMessageText = document.getElementById("appMessageText");
    elements.appMessageAction = document.getElementById("appMessageAction");

    elements.navItems.forEach((item) => {
        if (!item.hasAttribute("tabindex")) item.setAttribute("tabindex", "0");
        if (!item.hasAttribute("role")) item.setAttribute("role", "button");
    });

    return elements;
}
