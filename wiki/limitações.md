* Melhorar a relação entre as propriedades de navegação do entity framework,

* Criar telas faltantes no frontend, já existem os endpoint porém ainda falta as telas. 
Algumas delas são: pagina de adicionar materias e CRUD de linhas de pesquisa.

* Adicionar validações mais especificas nos campos. Backend e Frontend.

* Adicionar validação na criação das entidades, como não poder criar 2 alunos com o mesmo CPF. Nos services(backend)

* Melhorar templates para o envio de email.

* Adicionar filtros e paginação nos endpoints e nas tabelas do front.

* Tratamento de erro no front, (mostrar os erros que o back retorna).

* Criação de relatorios.

* Melhorar mensagens de erros do back, talvez traduzi-las para ficar mais claro.

* Melhorar o mapeamento doque aparece nas tabelas.

* fazer logout de login.

* Criação de testes unitários e de integração.

PAINEL ALUNOS:
1. Retirar a hora:min:segundos dos campos Data de Defesa e Data de Qualificação, mantendo apenas a data. Inverter a ordem, primeiro é a Qualificação e depois a Defesa.
2. Exibir todos os dados do estudante no Perfil do Estudante.
3. Corrigir a edição do Estudante, permitindo a atualização dos campos CPF, Matrícula, Data de Matrícula, Data de Entrada e Data de Nascimento.
4. Renomear 'Criar Extensão' para 'Prorrogação'.
5. Ao criar uma Dissertação, exibir mensagens de sucesso ou erro e certificar-se de que as informações de dissertação, orientador e coorientador sejam adicionadas ao Perfil do Estudante.
6. No cadastro de novos alunos, organizar os campos na seguinte ordem: Matrícula, Edital, Nome, CPF, Sexo, E-mail, Data de Nascimento, Instituição de Formação, Tipo da Instituição, Curso, Área, Ano de Formado, Bolsa.
7. Adicionar campos faltantes: sexo, status do aluno e proficiência em inglês.
8. Corrigir o default da opção Bolsa para "Sem bolsa" e grafar os outros nomes em maiúsculo: CEFET/RJ, CAPES, FAPERJ.
9. Ajustar a nomenclatura "Instituição de Graduação".
10. Corrigir as opções da Área, que devem estar em português: COMPUTAÇÃO, ENGENHARIA, EXATAS, HUMANAS, BIOLÓGICA.
11. Ajustar as opções do Tipo de Instituição para: PÚBLICA, PARTICULAR, CEFET/RJ.
12. Implementar validação no campo CPF durante o cadastro de um Novo Estudante, exibindo mensagens de erro em caso de CPF inválido.
 
PAINEL PROFESSORES:
1. Padronizar a seta na coluna "Opções" para redirecionar para o Perfil do Professor, em vez de atualizar.
2. Adicionar botão de "Editar Professor".
3. Permitir a atualização dos campos CPF e Matrícula na edição do Professor.
4. Implementar validação no campo CPF durante o cadastro de um Novo Professor, exibindo mensagens de erro em caso de CPF inválido.

PAINEL PESQUISADORES:
1. Adicionar opção para "Editar Pesquisadores".
2. Implementar validação no campo CPF durante o cadastro de um Novo Pesquisador, exibindo mensagens de erro em caso de CPF inválido.

PAINEL DISSERTAÇÕES:
1. Adicionar opção para "Editar Dissertações".
2. Exibir o nome do coorientador, caso exista.

PAINEL PROJETOS:
1. Padronizar a seta no menu "Opções" para redirecionar para o Perfil do Projeto, em vez de abrir um campo de atualização. No campo de "Editar Projeto", utilizar o botão "Update" (Atualizar) em vez de "Submit" (Enviar).

PAINEL EXTENSÕES:
1. Adicionar botão para "Editar Extensões".

PAINEL CSV:
1. Definir os campos/painel que serão carregados no arquivo CSV.

USUÁRIOS DO SISTEMA:
1. Adicionar botão para adicionar/atualizar/excluir usuários do sistema.