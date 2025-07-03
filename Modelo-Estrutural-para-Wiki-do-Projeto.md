# SAGA – Sistema de Acompanhamento e Gestão Acadêmica

## Breve Descrição

* **Função principal**: centralizar e automatizar a gestão acadêmica de programas de pós‑graduação.
* **Funções específicas**: criação, organização, manutenção, busca e recuperação de cadastros (estudantes, professores, pesquisadores externos, linhas e projetos), registro de orientações e anexos, definição de prazos (qualificação/defesa), importação/exportação de dados via CSV, geração de relatórios, notificações automáticas e painel React para interação.
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

A administradora **Marina** gera "Relatório → Prazos de Defesa", filtra pelo próximo semestre e exporta o PDF, encaminhando‑o à coordenação para análise de prazos críticos.

### Cenário Positivo 4

A estudante **Joana** acessa "Meu Perfil" e clica em "Exportar dados". O sistema gera um CSV com disciplinas, notas, orientações e prazos, fazendo o download instantaneamente.

### Cenário Negativo 1 (i.e. cenário que expõe uma limitação conhecida e esperada do programa)

A professora **Ana** tenta cadastrar um novo projeto de pesquisa sem selecionar a linha de pesquisa. O SAGA destaca o campo obrigatório e exibe a mensagem "Linha de pesquisa é obrigatória", impedindo o cadastro até a correção.

### Cenário Negativo 2

O administrador **Rafael** importa um CSV com colunas fora de ordem. O SAGA cancela a operação, apresenta uma lista das linhas inválidas e solicita a correção do arquivo.

### Cenário Negativo 3

O aluno **Paulo** tenta solicitar uma extensão de prazo sem informar o motivo. O botão "Enviar" permanece desabilitado até que o campo seja preenchido.

### Cenário Negativo 4

A usuária comum **Beatriz** digita manualmente a URL "/admin" tentando acessar a área administrativa. O sistema exibe "Permissão negada" e a redireciona para a página inicial.

## Documentação Técnica do Projeto

* **Especificação de requisitos**: desempenho mínimo de 100 usuários simultâneos, resposta < 300 ms para operações críticas, compatibilidade com PostgreSQL ≥ 15.
* **Arquitetura**: aplicação em camadas (Controladores API REST, Serviços de negócio, Repositórios EF Core, Modelos), autenticação JWT, background jobs Hangfire.
* **Modelo de dados**: PostgreSQL com migrações gerenciadas; identidade, projetos, orientações, prazos e anexos como tabelas‑chave.
* **Sobre o código**: backend ASP.NET Core (C# 12), frontend React + Vite (TypeScript), testes xUnit e React Testing Library; comentários em XML Doc e JSDoc; CI/CD GitHub Actions; diretrizes de compilação no `Directory.Build.props`.

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
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se o e‑mail já existir
     Então faça: utilize "Redefinir senha".
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para EDITAR ou REMOVER USUÁRIO faça:
    Passo 1: "Usuários" → pesquise pelo nome.
    Passo 2: Clique no ícone de edição ou remoção.
    Passo 3: Confirme a operação.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se o usuário estiver vinculado a registros críticos
     Então faça: transfira ou arquive os registros antes de remover.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para GERENCIAR CURSOS, LINHAS, PROJETOS ou ORIENTAÇÕES faça:
    Passo 1: Acesse o módulo correspondente no menu.
    Passo 2: Utilize "Criar", "Editar" ou "Remover" conforme necessidade.
    Passo 3: Salve para aplicar alterações.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se ocorrer erro de integridade
     É porque: existem referências pendentes; ajuste relacionamentos antes de excluir.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para IMPORTAR REGISTROS VIA CSV faça:
    Passo 1: "Importar CSV".
    Passo 2: Selecione o tipo de registro e faça upload do modelo preenchido.
    Passo 3: Revise a pré‑visualização e conclua.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se o arquivo estiver mal‑formatado
     Então faça: corrija conforme o relatório de erros e tente novamente.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para EXPORTAR REGISTROS VIA CSV faça:
    Passo 1: "Exportar CSV".
    Passo 2: Escolha o tipo de registro e filtros.
    Passo 3: Clique em "Gerar" e baixe o arquivo.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se não retornar dados
     É porque: não há registros dentro do filtro; ajuste critérios.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para DEFINIR PRAZO DE QUALIFICAÇÃO ou DEFESA faça:
    Passo 1: "Prazos" → "Novo".
    Passo 2: Selecione o estudante e a data limite.
    Passo 3: Salve para notificar o aluno.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se o prazo conflitar com outro
     Então faça: escolha nova data ou trate sobreposição com coordenação.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para APROVAR SOLICITAÇÕES DE EXTENSÃO faça:
    Passo 1: "Extensões" → lista pendentes.
    Passo 2: Clique em "Revisar".
    Passo 3: Aprove ou rejeite informando justificativa.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se faltar documentação
     Então faça: solicite complemento antes da aprovação.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para REDEFINIR SENHA DE USUÁRIO faça:
    Passo 1: "Usuários" → escolha o usuário.
    Passo 2: Clique em "Redefinir senha".
    Passo 3: Confirme; nova senha enviada por e‑mail.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para GERAR RELATÓRIO DE PRAZOS e ORIENTAÇÕES faça:
    Passo 1: "Relatórios".
    Passo 2: Escolha o tipo (Prazos/Orientações) e filtros.
    Passo 3: Clique em "Exportar PDF".
}

{ 
  Guia de Instruções:
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
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para REGISTRAR ORIENTAÇÃO faça:
    Passo 1: "Orientações" → selecione projeto.
    Passo 2: "Adicionar reunião" → descreva resumo e anexe arquivos.
    Passo 3: Salve para notificar o aluno.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para LANÇAR NOTAS faça:
    Passo 1: "Cursos" → escolha disciplina.
    Passo 2: "Lançar notas" → preencha avaliações.
    Passo 3: Confirme para publicar.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para VISUALIZAR SOLICITAÇÕES DE EXTENSÃO faça:
    Passo 1: "Extensões".
    Passo 2: Clique na solicitação para ver detalhes.
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ACOMPANHAR PRAZOS faça:
    Passo 1: "Prazos".
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ENVIAR COMUNICADO faça:
    Passo 1: "Comunicados" → "Novo".
    Passo 2: Escreva mensagem e selecione destinatários.
    Passo 3: Envie para notificar estudantes.
}
```

### Aluno

```
{ 
  Guia de Instructions:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ATUALIZAR DADOS PESSOAIS faça:
    Passo 1: "Meu perfil".
    Passo 2: Edite campos e clique "Salvar".
}

{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para ACOMPANHAR ORIENTAÇÕES, CURSOS e PRAZOS faça:
    Passo 1: Painel inicial; utilize abas "Orientações", "Disciplinas" e "Prazos".
}
```