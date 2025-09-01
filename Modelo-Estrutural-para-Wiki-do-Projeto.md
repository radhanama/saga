# SAGA – Sistema de Acompanhamento e Gestão Acadêmica

## Breve Descrição

* **Função principal**: centralizar e automatizar a gestão acadêmica de programas de pós‑graduação.
* **Funções específicas**: criação, organização, manutenção e consulta de cadastros (estudantes, professores, pesquisadores externos, cursos, linhas e projetos), registro de orientações com anexos, definição e prorrogação de prazos de qualificação/defesa, importação de estudantes e disciplinas via CSV, exportação de estudantes, professores e extensões em CSV e envio automático de e‑mails de notificação.
* **Usuários‑alvo**: administradores (secretarias e coordenação), professores (orientadores/docentes), estudantes (mestrandos/doutorandos) e pesquisadores externos (colaboradores).
* **Natureza**: ferramenta utilitária em evolução, construída como aplicação web em camadas (ASP.NET 8 + React) com API REST, já em ambiente piloto.
* **Ressalvas**: requer navegadores modernos, arquivos CSV no modelo oficial e perfis de acesso corretos; tentativas de acesso não autorizado resultam em bloqueio e mensagem de permissão negada.

## Visão de Projeto

---

### Cenário Positivo 1 (i.e. cenário que dá certo)

A administradora **Carla** acessa o menu "Importar CSV → Estudantes", faz upload do arquivo‑modelo com 60 ingressantes e confirma. O SAGA valida o conteúdo, cria os usuários, envia as credenciais por e‑mail e exibe um relatório de sucesso.

### Cenário Positivo 2

O professor **Luis** registra o andamento de uma orientação: em "Orientações → Projeto XYZ" ele clica em "Adicionar reunião", descreve o encontro, anexa o PDF do resumo e salva. O aluno visualiza as observações imediatamente.

### Cenário Positivo 3

A administradora **Marina** acessa "Exportar CSV → Professores" e gera o arquivo contendo todas as informações cadastradas. O documento é enviado à coordenação para conferência dos dados.

### Cenário Positivo 4

A estudante **Joana** recebe automaticamente um e‑mail avisando que sua data de defesa se aproxima em 30 dias. Assim ela e seu orientador podem se preparar com antecedência.

### Cenário Negativo 1 (i.e. cenário que expõe uma limitação conhecida e esperada do programa)

A professora **Ana** tenta gerar um relatório completo de orientações para enviar à coordenação. O sistema informa que a funcionalidade de relatórios detalhados ainda não está disponível e oferece apenas a exportação simples em CSV.

### Cenário Negativo 2

A estudante **Joana** deseja alterar seu telefone em "Meu perfil", mas a interface não permite editar dados pessoais. Ela precisa solicitar que a secretaria realize a atualização.

### Cenário Negativo 3

O professor **Luis** procura por projetos específicos utilizando filtros, porém a tabela de listagem não possui essa funcionalidade. Ele precisa percorrer diversas páginas para encontrar o registro desejado.

## Documentação Técnica do Projeto


Esta seção reúne as informações técnicas necessárias para quem deseja reutilizar ou evoluir o SAGA.

### Especificação de Requisitos Funcionais e Não-Funcionais
- **Funcionais:**
  - Cadastro, atualização e remoção de usuários, estudantes, professores, dissertações, extensões, projetos, linhas de pesquisa e disciplinas.
  - Importação de dados via arquivos CSV (estudantes e matérias cursadas).
  - Geração de relatórios personalizados (alunos, datas de qualificação, defesa, etc.).
  - Notificações de datas relevantes para os estudantes.
- **Não-Funcionais:**
  - Interface responsiva e amigável, com suporte aos principais navegadores modernos.
  - Validação robusta dos dados tanto no front-end quanto no back-end.
  - Segurança no acesso através de autenticação (JSON Web Tokens) e controle de permissões.
  - Escalabilidade e manutenção facilitada, utilizando arquitetura N-tier.

### Modelo de Arquitetura e Dados
- **Arquitetura:**  
  O sistema adota uma arquitetura N-tier, dividida nas seguintes camadas:
  - **Modelo (Models):** Contém entidades, DTOs, enums e mappers que representam as tabelas do banco de dados.
  - **Apresentação (Controllers):** Exposição de endpoints REST para comunicação com o front-end.
  - **Serviços (Services):** Lógica de negócio e orquestração entre os controllers e o acesso aos dados.
  - **Dados (Data):** Repositórios e contexto do banco de dados, utilizando Entity Framework Core com PostgreSQL.
- **Tecnologias Utilizadas:**  
  - **Back-end:** ASP.NET Core, Entity Framework Core, PostgreSQL, Docker.  
  - **Front-end:** React, com estrutura organizada em componentes, páginas e estilos SCSS.
  - **Infraestrutura:** Jobs em segundo plano (Hangfire) para envio de e-mails e execução de tarefas periódicas.

### Modelo Funcional do Software
- **Fluxos Principais:**  
  - **Gestão de Usuários e Entidades:** CRUD para cada entidade (estudantes, professores, dissertações, projetos, etc.).  
  - **Importação e Validação de Dados:** Processamento de arquivos CSV com validações para evitar duplicidades e erros de formatação.  
  - **Interface e Usabilidade:** Painéis de visualização e formulários de cadastro/editoração que priorizam a experiência do usuário, conforme os protótipos e manuais fornecidos.

### Sobre o Código
- **Linguagens e Técnicas:**  
  - **Front-end:** React com componentes reutilizáveis, gerenciamento de estado e rotas.  
  - **Back-end:** ASP.NET Core com Entity Framework, utilizando boas práticas de injeção de dependências, separação de responsabilidades e testes (unitários e de integração).  
- **Comentários e Diretrizes:**  
  - Código comentado conforme as boas práticas para facilitar a manutenção e a evolução.
  - Diretivas e configurações específicas (ex.: Dockerfiles, scripts de migração) documentados para facilitar o setup do ambiente de desenvolvimento.


## Manual de Utilização para Usuários Contemplados

> O manual a seguir abrange **todas as funções previstas** para cada tipo de usuário.

### Administrador

```
{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para CADASTRAR USUÁRIO faça:
    Passo 1: "Usuários" → "Novo usuário".
    Passo 2: Escolha o tipo e preencha os campos.
    Passo 3: Confirme; credenciais enviadas por e‑mail.

  Exceções ou potenciais problemas:
  ---
  Se o e‑mail já existir
     Então faça: utilize "Redefinir senha".

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para EDITAR ou REMOVER USUÁRIO faça:
    Passo 1: "Usuários" → pesquise pelo nome.
    Passo 2: Clique no ícone de edição ou remoção.
    Passo 3: Confirme a operação.

  Exceções ou potenciais problemas:
  ---
  Se o usuário estiver vinculado a registros críticos
     Então faça: transfira ou arquive os registros antes de remover.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para GERENCIAR CURSOS, LINHAS, PROJETOS ou ORIENTAÇÕES faça:
    Passo 1: Acesse o módulo correspondente no menu.
    Passo 2: Utilize "Criar", "Editar" ou "Remover" conforme necessidade.
    Passo 3: Salve para aplicar alterações.

  Exceções ou potenciais problemas:
  ---
  Se ocorrer erro de integridade
     É porque: existem referências pendentes; ajuste relacionamentos antes de excluir.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para IMPORTAR REGISTROS VIA CSV faça:
    Passo 1: "Importar CSV".
    Passo 2: Selecione o tipo de registro e faça upload do modelo preenchido.
    Passo 3: Revise a pré‑visualização e conclua.

  Exceções ou potenciais problemas:
  ---
  Se o arquivo estiver mal‑formatado
     Então faça: corrija conforme o relatório de erros e tente novamente.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para EXPORTAR REGISTROS VIA CSV faça:
    Passo 1: "Exportar CSV".
    Passo 2: Escolha o tipo de registro e filtros.
    Passo 3: Clique em "Gerar" e baixe o arquivo.

  Exceções ou potenciais problemas:
  ---
  Se não retornar dados
     É porque: não há registros dentro do filtro; ajuste critérios.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para DEFINIR PRAZO DE QUALIFICAÇÃO ou DEFESA faça:
    Passo 1: "Prazos" → "Novo".
    Passo 2: Selecione o estudante e a data limite.
    Passo 3: Salve para notificar o aluno.

  Exceções ou potenciais problemas:
  ---
  Se o prazo conflitar com outro
     Então faça: escolha nova data ou trate sobreposição com coordenação.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para REGISTRAR EXTENSÃO DE PRAZO faça:
    Passo 1: "Extensões" → "Nova".
    Passo 2: Informe o estudante, o tipo (Defesa ou Qualificação) e a quantidade de dias.
    Passo 3: Salve para atualizar as datas do aluno.

  Exceções ou potenciais problemas:
  ---
  Se o número de dias for inválido
     Então faça: corrija antes de salvar.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para REDEFINIR SENHA DE USUÁRIO faça:
    Passo 1: "Usuários" → escolha o usuário.
    Passo 2: Clique em "Redefinir senha".
    Passo 3: Confirme; nova senha enviada por e‑mail.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ATRIBUIR ORIENTADOR A PROJETO faça:
    Passo 1: "Projetos" → selecione o projeto.
    Passo 2: Clique em "Definir orientador".
    Passo 3: Escolha o professor e salve.
}
```

### Professor

```
{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para CONSULTAR PROJETOS e ORIENTANDOS faça:
    Passo 1: "Projetos" ou "Orientações".
    Passo 2: Use filtros se necessário.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para REGISTRAR ORIENTAÇÃO faça:
    Passo 1: "Orientações" → selecione projeto.
    Passo 2: "Adicionar reunião" → descreva resumo e anexe arquivos.
    Passo 3: Salve para notificar o aluno.

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ACOMPANHAR PRAZOS faça:
    Passo 1: "Prazos".
}
```

### Aluno

```
{ 
  Guia de Instructions:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para VISUALIZAR DADOS PESSOAIS faça:
    Passo 1: "Meu perfil".

  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ACOMPANHAR ORIENTAÇÕES, CURSOS e PRAZOS faça:
    Passo 1: Painel inicial; utilize abas "Orientações", "Disciplinas" e "Prazos".
}
```