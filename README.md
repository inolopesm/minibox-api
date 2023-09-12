# minibox-api

O `minibox-api` é o lado backend do [minibox](https://github.com/inolopesm/minibox). Este projeto foi feito utilizando [Node.js](https://nodejs.org/), [Fastify](https://fastify.dev/) e [Knex.js](https://knexjs.org/), e como banco de dados [PostgreSQL](https://www.postgresql.org/)

## Requisitos mínimos

1. [Node.js](https://nodejs.org/) (Confira a versão no [package.json](./package.json))
1. [npm.js](https://npmjs.com/) (Confira a versão no [package.json](./package.json))
2. [PostgreSQL](https://www.postgresql.org/) v15.4-bookworm

## Instalação

1. Clone o repositório: `git clone git@github.com:inolopesm/minibox-api.git`
2. Acesse o diretório: `cd minibox-api`
3. Instale as dependências: `npm install`

## Configuração

### Desenvolvimento

1. Crie o arquivo de configuração: `cp .env.example .env`
2. Preencha o `.env` com os valores corretos

### Produção

1. Observe as variáveis dentro do `.env.example`
2. Na plataforma de produção configure tais variáveis com os valores corretos

## Usagem

### Desenvolvimento

1. Execute o projeto em modo de desenvolvimento: `npm run dev`

### Produção

1. Construa a versão do projeto para produção: `npm run build`
2. Execute o projeto em modo de produção: `npm start`

## Licença

Este projeto está sob a licença [GPL-3.0](./LICENSE)
