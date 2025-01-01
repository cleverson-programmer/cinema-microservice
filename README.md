# Sistema de Serviço de Cinema

Um sistema de serviço de cinema desenvolvido com a arquitetura **MVC** baseado em **microserviços**, com **API GATEWAY**.  

## Descrição do Projeto

O sistema é composto por múltiplos microserviços, onde cada um desempenha uma função específica:

- **movies-service**:  
  Responsável por listar:
  - Todos os filmes disponíveis.
  - Filmes específicos.
  - Filmes em cartaz.
  - E outras informações relacionadas a filmes.

- **cinema-catalog-service**:  
  Responsável por listar:
  - Cinemas disponíveis em diversas cidades.
  - Filmes disponíveis em cinemas de uma determinada cidade.
  - Outras informações relacionadas aos cinemas.

- **API Gateway**:  
  Centraliza o acesso aos microserviços e realiza as seguintes funções:
  - Verificação e autenticação de usuários.
  - Validação de requisições.

## Tecnologias Utilizadas

- **Node.js**  
- **Arquitetura MVC**  
- **Microserviços**

## Próximos Passos

Atualmente, o projeto consiste apenas no backend, mas é possível expandi-lo adicionando novas funcionalidades, como:

- Gerenciamento de assentos disponíveis em cinemas.
- Um microserviço para vendas de produtos da bomboniere dos cinemas.

## Como Contribuir

Se você tiver interesse em colaborar, sinta-se à vontade para enviar pull requests ou abrir issues com sugestões de melhorias e novas funcionalidades!

---

**Nota**: O projeto está em desenvolvimento e novas features podem ser adicionadas no futuro.
