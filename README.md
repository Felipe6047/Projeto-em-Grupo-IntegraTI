# TechSolution - Front-end (Gestão de Ativos e Serviços de TI)

Front-end em **HTML/CSS/JavaScript** (vanilla) com **Bootstrap**.  
Preparado para integrar com um back-end em **Node.js** via endpoints em `/api/...`.

## Como rodar (sem back-end)

Você pode abrir com qualquer servidor estático:

- **VSCode/Cursor (Live Server)**: clique com botão direito em `frontend/index.html` → "Open with Live Server".
- **Python** (se tiver instalado):

```bash
cd frontend
python -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Integração com o back-end (depois)

O front chama URLs em `BASE_URL = "/api"` (veja `frontend/src/js/api/apiClient.js`).  
Quando o back-end estiver pronto, basta manter os mesmos endpoints (ou ajustar o `BASE_URL`).

## Estrutura

- `frontend/index.html`: shell do app + Bootstrap (CDN)
- `frontend/src/css/styles.css`: estilos do projeto
- `frontend/src/js/app.js`: bootstrap do app + roteamento
- `frontend/src/js/api/*`: client HTTP + modo mock (LocalStorage)
- `frontend/src/js/pages/*`: telas (dashboard, cadastros, chamados, login)

