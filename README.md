# API de Pagamento

Esta é uma API robusta de processamento de pagamentos desenvolvida com AdonisJS. O sistema gerencia produtos, clientes, transações financeiras e possui integração inteligente com múltiplos gateways de pagamento, suportando fallback automático e estorno (refund).

## Tecnologias Utilizadas

* Framework: AdonisJS
* Linguagem: TypeScript
* Banco de Dados: MySQL (via Lucid ORM)
* Autenticação: Obeject-Based Access Tokens (API Tokens)
* Testes: Japa (Unitários e Funcionais) & Sinon.js (Mocks)

## Funcionalidades Principais

* Gestão de Usuários: Cadastro, Login e controle de permissões por Níveis (ADMIN, MANAGER, FINANCE, USER).
* Catálogo de Produtos: CRUD completo de produtos com status de ativação.
* Base de Clientes: Gestão de clientes para faturamento.
* Fluxo de Transações:
* Criação de transações com múltiplos itens.
   * Cálculo automático de valor total.
   * Integração com Gateways (Gateway1 e Gateway2).
   * Sistema de Fallback: Se um gateway falhar, a API tenta processar automaticamente no próximo gateway ativo de maior prioridade.
   * Refund: Estorno de transações processadas com atualização de status.
* Gateways Dinâmicos: Possibilidade de ativar/desativar gateways e alterar prioridades em tempo real via API.

## Como Rodar o Projeto

Siga os passos abaixo para subir os serviços de gateway e o backend.
1. Subir os Gateways Externos
Os gateways simulam os provedores de pagamento externos.

```bash
cd gateway
docker compose up --build -d
```

2. Configurar e rodar o Backend
Abra um novo terminal na raiz do projeto e execute:

```bash
cd backend/# Sobe o banco de dados MySQL
docker compose -f docker-compose.mysql.yml up --build -d
```

### Instala as dependências (caso não tenha feito)

```bash
npm install
```

### Prepara o banco de dados

```bash
node ace migration:run
node ace db:seed
```

### Inicia o servidor em modo de desenvolvimento

```bash
npm run dev
```

* A API estará disponível em: http://127.0.0.1:3333/api/v1

## Executando os Testes
Para rodar a suíte completa de testes (unitários e funcionais), siga o mesmo fluxo de preparação do backend e execute o comando de teste:

```bash
cd backend/# Garanta que o banco de testes esteja pronto
node ace migration:run
node ace db:seed
# Executa os testes via Japa
node ace test
```

## Documentação das Rotas (API v1)

Todas as rotas abaixo possuem o prefixo /api/v1.
Autenticação (/auth)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | /signup | Cadastro de novo usuário | Público |
| POST | /login | Autenticação | Público |
| POST | /logout | Encerrar sessão | Autenticado |

Perfil (/account)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | / | Ver dados do perfil | Autenticado |
| PUT | / | Atualizar perfil | Autenticado |
| DELETE | / | Desativar conta | Autenticado |

Produtos (/products)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | / | Listar produtos | Autenticado |
| GET | /:id | Ver detalhes do produto | Autenticado |
| POST | / | Criar produto | ADMIN, MANAGER, FINANCE |
| PUT | /:id | Editar produto | ADMIN, MANAGER, FINANCE |
| DELETE | /:id | Remover produto | ADMIN, MANAGER |

Clientes (/clients)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | / | Listar clientes | ADMIN, MANAGER |
| GET | /:id | Ver detalhes do cliente | ADMIN, MANAGER |
| POST | / | Criar cliente | ADMIN, MANAGER |
| PUT | /:id | Editar cliente | ADMIN, MANAGER |
| DELETE | /:id | Remover cliente | ADMIN |

Gateways (/gateways)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| PATCH | /:id/toggle | Ativar/Desativar gateway | ADMIN |
| PATCH | /:id/priority | Alterar prioridade de fallback | ADMIN |

Transações (/transactions)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | / | Listar transações | Autenticado |
| GET | /:id | Ver detalhes | Autenticado |
| POST | / | Criar nova transação | ADMIN, FINANCE |
| POST | /:id/refund | Estornar transação | ADMIN, FINANCE |
| PUT | /:id | Atualizar transação | ADMIN, FINANCE |

