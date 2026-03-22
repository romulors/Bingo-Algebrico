# Descrição dos Fluxos de Trabalho
Para cada um dos requisitos, foi criado um fluxo de trabalho simplificado, para auxiliar na descrição da atividade a ser desempenhada com o software.

Tipo de Requisito: Funcional
- RF-01	Escolher tópicos
- RF-02	Selecionar equações
- RF-04	Selecionar parâmetros do Bingo
- RF-06	Visualizar e editar questões
- RF-07	Criar cartelas com equações
- RF-11	Editar tema visual
- RF-12	Visualizar cartelas
- RF-13	Imprimir cartelas
- RF-15	Salvar informações em arquivos

## RF 01 - Escolher Tópicos
Professor seleciona arquivos com as definições dos modelos e tópicos
Software lista opções de tópicos disponíveis
Professor escolhe quais tópicos utilizará

## RF 02 – Selecionar Equações
Pré-Requisito: RF-01
Professor seleciona arquivos com as definições dos modelos e tópicos
Software lista opções de equações disponíveis
Professor seleciona quais equações utilizará

## RF 03 - Definir as restrições acerca dos números e equações utilizadas
Pré-Requisito: RF-02
Professor escolhe um intervalo de valores para cada variável
Professor define tipo de número (Naturais, inteiros, reais etc) para cada variável

## RF 04 – Selecionar parâmetros do Bingo
Pré-Requisito: RF-02
Professor informa número total de questões
Professor informa número de cartelas
Professor informa quantas repetições poderá ter cada questão
Professor informa quantos problemas de cada modelo terá cada cartela
Software calcula número de questões por cartela
Software salva as informações que definem o Bingo

## RF 06 – Visualizar e editar questões
Pré-Requisito: RF 04
Software carrega as informações de um Bingo
Professor confirma ou edita o número de questões

## RF 07 – Criar cartelas com equações
Pré-Requisito: RF-04
Professor solicita criação de cartelas
Software cria cartelas
Software mostra para Professor
Professor aprova as cartelas
Professor salva as cartelas

## RF 11 – Editar Tema Visual
Professor escolhe parâmetros do visual da cartela
Professor escolhe cores da cartela
Professor escolhe logo da instituição
Professor salva informações

## RF 12 – Visualizar Cartelas
Pré-Requisito: RF-07
Professor carrega cartelas
Software exibe todas as cartelas

## RF 13 – Imprimir Cartelas
Pré-Requisito: RF-12
Professor carrega cartelas
Software exibe todas as cartelas
Professor seleciona cartela a ser impressa

## RF 15 – Salvar informações em arquivos
Professor seleciona o que exportar (dados do bingo, cartelas, tema visual, distribuição de tópicos e temas, equações)
Software salva os dados
