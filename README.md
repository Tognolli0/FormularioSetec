# Formulario Setec

Sistema full stack para centralizar solicitacoes de logistica de viagens, com formulario unico para operacao e painel administrativo para acompanhamento.

## Stack

- Frontend em React + Vite
- Backend em ASP.NET Core Minimal API
- Banco em PostgreSQL
- Exportacao de planilhas com SheetJS
- Deploy pensado para Vercel + Render

## Estrutura

- `meu-formulario-logistica`: interface principal
- `SetecApi`: API e persistencia
- `Formulario.sln`: solucao do backend

## Principais funcionalidades

- Cadastro de viagens e hospedagens
- Fluxo unico para reduzir perda de dados
- Painel administrativo para acompanhamento
- Exportacao de relatorios

## Como rodar

1. Configure a string de conexao localmente.
2. Defina `DATABASE_URL` no ambiente ou em configuracao local nao versionada.
3. Rode a API em `SetecApi`.
4. Rode o frontend em `meu-formulario-logistica`.

## Seguranca

Credenciais reais foram removidas do repositorio.
Toda configuracao sensivel deve ficar em variaveis de ambiente ou arquivos locais ignorados pelo Git.

## Observacao

Esse projeto tem bom potencial de portifolio por representar um caso de uso real com front, API e processo operacional.
