# Nome do Seu Projeto

## Breve Descrição
Inclua na breve descrição as seguintes informações:
- a principal função de seu programa (e.g. gerenciador de datasets)
- exemplos de funções específicas relevantes que o programa oferece (e.g. criação, organização, manutenção, busca e recuperação de datasets)
- que usuário(s) o seu programa foi concebibo para atender primordialmente (e.g. pesquisadores especializados em [QUE ÁREA?], profissionais especializados em [QUE ÁREA?], professores [DE QUE DISCIPLINAS, EM QUE GRAU, ETC.], estudantes [DE QUE DISCIPLINAS, EM QUE GRAU, ETC.])
- a natureza do seu programa (e.g. prova (parcial ou completa) de conceito, ferramenta utilitária (acabada ou inacabada), módulo de sistema em desenvolvimento (por você ou por colaboradores)
- ressalvas, se houver (informe de maneira breve, porém clara, qualquer ressalva de uso de que os interessados em seu programa devem estar cientes) 

## Visão de Projeto

Esta seção deve conter **no mínimo 4 cenários** (**2 de cada tipo indicado**), cuja função é orientar não apenas o projeto do software, mas também o seu uso e eventual evolução. No caso de **projeto**, os cenários expressam a INTENÇÃO DO CRIADOR, funcionando como uma bússola para manter ou corrigir rumos. Os cenários podem ser continuamente revisados, a fim de que ao final do projeto estejam em plena sintonia com o que o programa é, faz e não faz. No caso de **uso**, os cenários orientam a INTERPRETAÇÃO DO USUÁRIO ao interagir com o programa, permitindo que possa julgar se está fazendo um uso esperado ou inesperado do programa, o que ajuda muito a decidir o que fazer em casos de eventuais erros de interação ou execução. Finalmente, no caso de **evolução** do programa, os cenários ORIENTAM PROGRAMADORES COLABORADORES a como, quando e se reutilizar e modificar o programa para novas finalidades ou condições.

<div style="margin-left:10px; background:#D3E6F6; padding:3px;">
<p>Onde aprender sobre o que são cenários, para que servem, com que se parecem, e mais:<br />
<a href="https://www.sciencedirect.com/science/article/pii/S0953543800000230#FIG2" target="_New"><b>Artigo de John Carroll (1999)</b></a>.</p>

<p>O objetivo desta parte do relatório é levar vocês a pensarem sobre a experiência **do outro** com o programa de vocês. Este exercício é muito simples e extremamente benéfico para o resultado final do programa. Aproveitem a oportunidade.<p>
</div> 

***

### Cenário Positivo 1 (i.e. cenário que dá certo)

[Esta é uma tradução do Cenário do Artigo de John Carroll:] 
Harry está interessado em problemas com pontes; quando criança, ele viu uma pequena ponte desabar quando seus apoios foram minados após uma forte chuva. Ele abre o estudo de caso da Ponte Tacoma Narrows e pede para ver o filme de quando ela desmoronou. Ele fica chocado ao ver a ponte primeiro balançar, depois ondular e, por fim, se desprender. Ele rapidamente reproduz o filme e, em seguida, abre o módulo do curso associado a movimento harmônico. Ele navega pelo material do curso (sem fazer os exercícios), salva o trecho do filme em seu caderno com uma anotação em áudio e, em seguida, faz uma consulta em linguagem natural para encontrar referências a outras manifestações físicas do movimento harmônico. Aí, ele passa para um estudo de caso envolvendo flautas e pícolos

> Como é explicado no artigo, este cenário "evoca" várias propriedades de uma tecnologia que Harry está usando como auxílio para seus estudos escolares. Reparem que não há nenhum detalhamento de "como" Harry abre o estudo de caso, como reproduz o filme, como salva o vídeo em seu caderno, como faz a anotação em áudio, como faz outra busca. Porém, neste curto parágrafo já está muito claro o que a tecnologia se propõe a fazer e quais as suas principais funções. Também está claro o perfil de pelo menos 1 dos tipos de usuários visados. Quando um programa tem vários usos e usuários visados, os cenários ajudam a balizar o que podemos esperar em cada caso.

### Cenário Positivo 2

[Coloque aqui o seu segundo cenário que dá certo]

### Cenário Negativo 1 (i.e. cenário que expõe uma limitação conhecida e esperada do programa)

[Vou usar aqui uma variante do cenário de Carroll para ilustrar o que é um cenário negativo:]
Harry está interessado em problemas com pontes; quando criança, ele viu uma pequena ponte desabar quando seus apoios foram minados após uma forte chuva. Ele abre o estudo de caso da Ponte Tacoma Narrows e pede para ver o filme de quando ela desmoronou. Porém, ao invés de aparecer um vídeo do acidente com aquela ponte, aparece uma tela com uma mensagem do reprodutor. Ele não entende muito bem a mensagem, mas parece que há uma configuração especial que ele tem que fazer no browser dele para que o vídeo seja reproduzido. Ele tenta fazer o que é indicado, mas não tem resultado positivo. Desanimado, ele desiste de ver aquele vídeo e procura outro exemplo para seu estudo sobre movimento harmônico.

> Este cenário ilustra o que pode acontecer por causa de uma limitação do programa. Não foram feitos testes exaustivos com todos os tipos de vídeo, em todos os browsers. Apenas os tipos atuais mais utilizados foram testados. Assim, pode ser que um vídeo em formato mais antigo ou com um reprodutor menos utilizado hoje não funcione corretamente. Na maioria destes casos, uma mudança de configuração no navegador (instruída pela própria interface do navegador) resolve o problema. 

### Cenário Negativo 2

[Coloque aqui o seu segundo cenário que expõe uma outra limitação do seu programa, ou um aspecto diferente da anterior, que não aparece no cenário negativo 1]

## Documentação Técnica do Projeto

Esta seção da Wiki se destina a pessoas que queiram reutilizar, total ou parcialmente, o seu programa. Portanto, ofereça todas as informações necessárias. Os três itens a seguir são os mais utilizados. Escolha com o(a) orientador(a) do projeto quais destes itens devem ser incluídos. Para cada item incluído, crie uma seção específica.
- Especificação de requisitos funcionais e não-funcionais do sotware
- Descrição ou modelo de arquitetura, dados, semântica ou outra dimensão relevante do software
- Descrição ou modelo funcional do software
- Sobre o código (detalhes da linguagem ou da técnica de programação utilizada, da estratégia de comentários em linha, das diretivas de compilação, se houver, etc.)

## Manual de Utilização para Usuários Contemplados

> O manual de utilização deve ser elaborado **para todos os tipos de usuários contemplados**. Deve também ser consistente com todo o restante do conteúdo da Wiki, o que inclui descrição, cenários e documentação técnica.

O formato mais prático para a elaboração de um manual de uso é seguir a estrutura sugerida a seguir, **para cada tarefa que o usuário pode realizar (o que envolve usar várias funções) e para cada função básica que o programa oferece**:

```
{ 
  Guia de Instruções:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Para [Tarefa A: por exemplo, no cenário usado, BUSCAR VÍDEO] faça:
  Passo 1: ...
  Passo 2: ...
  ...
  Passo N: ...

  >>> Se houver diferentes maneiras de realizar a Tarefa A, descreva cada uma delas.
  >>> E se em certos contextos, uma alternativa for melhor que outra, informe e explique.

  Exceções ou potenciais problemas:
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  Se [Condição Prevista C1: por exemplo, o vídeo for encontrado mas o link está 'quebrado']
     {
     Então faça: [Passo 1, Passo 2, ..., Passo N] 
     ou
     É porque: [explique o problema, se não há uma sugestão para solucionar] 
     } 
  
  Se [Condição Prevista C2: ... 
  ...
  Se [Condição Prevista CN: ...      
}

>>> Repita a estrutura do Guia acima para cada tarefa e função básica.

```