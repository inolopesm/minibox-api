# minibox-api

O `minibox-api` é o lado backend do [minibox](https://github.com/inolopesm/minibox). Este projeto foi feito utilizando [Node.js](https://nodejs.org/), [Serverless](https://www.serverless.com/) e [Knex.js](https://knexjs.org/), e como banco de dados [PostgreSQL](https://www.postgresql.org/)

## Requisitos mínimos

1. [Node.js](https://nodejs.org/) (Confira a versão no [package.json](./package.json))
2. [npm.js](https://npmjs.com/) (Confira a versão no [package.json](./package.json))
3. [PostgreSQL](https://www.postgresql.org/) v15.4-bookworm

## Instalação

1. Clone o repositório: `git clone git@github.com:inolopesm/minibox-api.git`
2. Acesse o diretório: `cd minibox-api`
3. Instale as dependências: `npm install`
3. Instale o pacote serverless de forma global: `npm install --global serverless`

## Configuração

### Desenvolvimento

1. Crie o arquivo de configuração: `cp .env.example .env.local`
2. Preencha o `.env.local` com os valores corretos

### Produção

1. Crie o arquivo de configuração: `cp .env.example .env.production`
2. Preencha o `.env.production` com os valores corretos
3. Altere o domínio customizado dentro do `serverless.yml` se for necessário

## Usagem

### Desenvolvimento

1. Execute o projeto em modo de desenvolvimento: `npm run sls:offline`

### Produção

1. Crie o domínio customizado: `npm run sls:create_domain`
2. Faça o deploy: `npm run sls:deploy:production`

## Licença

Este projeto está sob a licença [GPL-3.0](./LICENSE)
