# Frontend Formulario Setec

Aplicacao React responsavel pelo formulario operacional e pelo painel administrativo do projeto `FormularioSetec`.

## Responsabilidades

- Registrar solicitacoes de logistica em um fluxo unico
- Liberar painel administrativo com chave local
- Listar registros gravados pela API
- Exportar dados para Excel com `xlsx`

## Ambiente local

1. Instale as dependencias com `npm install`
2. Copie `.env.example` para um arquivo local nao versionado, se necessario
3. Configure `VITE_API_URL`
4. Configure `VITE_ADMIN_KEY`
5. Rode `npm run dev`

## Build

- Desenvolvimento: `npm run dev`
- Producao: `npm run build`

## Observacao

O frontend foi organizado para servir como projeto de portfolio com caso de uso real, integracao com API e operacao administrativa simples.
