## 1. Escopo positivo : o que será implementado
Será desenvolvido um aplicativo que auxilie o professor de matemática a criar as cartelas do Bingo Algébrico. 

Neste desenvolvimento, são considerados os tópicos a serem apresentados aos alunos, com seus respectivos modelos de equações a serem trabalhados. Aplica-se restrições acerca dos números e equações utilizadas. 

Seleciona-se os parâmetros associados à criação do jogo, como o número de problemas/questões por cartela, o número total de cartelas e a distribuição de modelos de problemas por cada cartela. Outros parâmetros, como número mínimo e máximo de repetições de questões em cartelas, são selecionados.

O Software calcula o número total de questões únicas a serem criadas a partir dos modelos, permitindo edição deste número por parte do professor. As questões são criadas e distribuídas em todas as cartelas, conforme parâmetros de distribuição previamente selecionados. São criadas cartelas para os alunos e para o professor (esta última com as respostas dos problemas).

Todas as informações informadas poderão ser salvas em um arquivo local, a ser baixado pelo usuário professor.

As equações a serem trabalhadas utilizam operações simples (soma, subtração, multiplicação, divisão, frações, operações trigonométricas, potência, radiciação, etc).


## 2. Escopo negativo : o que não será implementado
A aplicação do Bingo Algébrico, em sala de aula, bem como o processo de sorteio de qual questão/número sairá no bingo, não serão realizados pelo Software. O acompanhamento do preenchimento das cartelas dos alunos também não será realizado pelo software. O anuncio de ‘Bingo’, ou seja, ao ser completada uma cartela, ficará a cargo do aluno.

O processamento das equações ocorrerá, inicialmente, para operações matemáticas mais simples. Operações complexas como cálculo de matrizes, operações de integração, operações de derivação e similares não serão implementadas na primeira versão do programa.


## 3. Restrições
O Bingo Algébrico será desenvolvido em Javascript (juntamente com CSS e HTML) para que possa ser facilitada a sua distribuição para professores, através da internet, devido ao contexto da mobilidade atual (com tablets e smartphones) bem como à variedade de sistemas operacionais presentes (Windows, Linux e Macos).

Como o aplicativo será responsável pela criação dos dados em uma página Web, fica ao encargo do professor realizar a impressão (enviando o comando imprimir ao navegador).

Apesar do sistema ser online, não existirá persistência de dados entre sessões distintas. Porém, será possível salvar os dados exportanto um arquivo de configuração. Este arquivo poderá ser importado futuramente.


## 4. Premissas
- O professor de matemática possui acesso à Internet e à impressoras;
- O professor possui algum editor de texto (Microsoft Word, Onlyoffice, etc) com suporte a equações Unicode ou Latex para criar as equações;
- As equações são formadas a partir da substituição de variáveis genéricas (letras do alfabeto) que serão informadas como variáveis.
- As equações deverão ser relacionadas a operações simples de matemática, visto que o programa não é um resolvedor genérico de equações.
	

## 5. Requisitos Funcionais - O aplicativo deve:
- RF 01 - Escolher os tópicos que serão apresentados aos alunos;
- RF 02 - Definir os modelos de equações a serem trabalhados;
- RF 03 - Definir as restrições acerca dos números e equações utilizadas;
- RF 04 - Selecionar os parâmetros associados à criação do jogo, como o número de problemas/questões por cartela, o número total de cartelas e a distribuição de modelos de problemas por cada cartela;
- RF 05 - Selecionar outros parâmetros, como número mínimo e máximo de repetições de questões em cartelas;
- RF 06 - Visualizar o número total de questões únicas a serem criadas a partir dos modelos e permitir a edição deste número;
- RF 07 - Criar cartelas para os alunos e para o professor (esta última com as respostas dos problemas);
- RF 08 - Possibilitar a escolha da faixa de números a serem sorteados durante o jogo.
- RF 09 - Possibilitar a escolha da dificuldade das equações a serem incluídas nas cartelas.
- RF 10 - Criar e distribuir as questões em todas as cartelas, conforme parâmetros de distribuição previamente selecionados;
- RF 11 - Possibilitar a escolha de diferentes temas visuais para as cartelas, com cores e imagens diferentes.
- RF 12 - Permitir a exibição das equações sorteadas em um painel de controle para o professor.
- RF 13 - Disponibilizar uma ferramenta para realizar a cópia de uma cartela já existente.
- RF 14 - Possibilitar a exportação dos dados dos jogos em formato CSV para posterior análise.
- RF 15 - Salvar as informações em um arquivo local, a ser baixado pelo usuário professor.


## 6. Requisitos não-funcionais – O aplicativo possui as seguintes características
- RNF 01 - O aplicativo deve ser desenvolvido em Javascript (juntamente com CSS e HTML);
- RNF 02 - O aplicativo deve ser responsivo, para ser utilizado em diferentes dispositivos;
- RNF 03 - O aplicativo deve ser fácil de usar e intuitivo, para que possa ser utilizado por usuários com diferentes níveis de conhecimento em informática;
- RNF 04 - O aplicativo deve ter boa performance, para que as operações de criação das cartelas e questões sejam realizadas de forma rápida;
- RNF 05 - O aplicativo deve permitir a exportação dos dados em um arquivo de configuração, para que os dados possam ser salvos e importados futuramente;


## 7. Análise dos Requisitos de Software

Durante a Análise dos Requisitos, foi verificado que haviam requisitos duplicados, requisitos desnecessários e requisitos emergentes (que derivam da existência dos requisitos originais). Os seguintes requisitos abaixo foram removidos do desenvolvimento do software:
- RF-03, RF-05, RF-08, RF-10, RF-14: Requisitos duplicados
- RF-09: Requisito desnecessário
Uma nova listagem foi criada, citando a importância, a fonte e se foi ou não alocado. Nesta nova listagem, o nome dos requisitos foi brevemente alterado para melhor representar o tema do qual trata.
