# 🚀 Setec Logística Unificada v2.0

Sistema Full Stack robusto desenvolvido para a **Setec**, focado na digitalização e automação da logística de viagens para consultores especialistas e médicos. O sistema substitui o controle manual por uma plataforma dinâmica com banco de dados em nuvem e relatórios automatizados.

---

## 📺 Visual do Projeto
* **Interface:** Dark Mode com identidade visual Setec (Preto e Laranja).
* **UX:** Formulário de seção única para evitar perda de dados.
* **Admin:** Dashboard de monitoramento em tempo real com acesso via Token.

---

## 🛠️ Stack Tecnológica

### **Front-end (Client)**
* **React + Vite**: Interface reativa e build ultrarápido.
* **Tailwind CSS**: Estilização moderna com *Glassmorphism*.
* **SheetJS (XLSX)**: Geração de relatórios Excel diretamente no navegador.
* **Vercel**: Hospedagem e Deploy contínuo do Front-end.

### **Back-end (API)**
* **ASP.NET Core 9 (Minimal APIs)**: API de alta performance.
* **Entity Framework Core**: Mapeamento objeto-relacional (ORM).
* **Npgsql**: Driver de conexão para PostgreSQL.
* **Docker**: Conteinerização da aplicação para máxima portabilidade.
* **Render**: Hospedagem da API em ambiente Docker.

### **Banco de Dados**
* **PostgreSQL (Supabase)**: Banco de dados relacional em nuvem.
* **Connection Pooling (Porta 6543)**: Gerenciamento de conexões via Transaction Pooler do Supabase.

---

## 📂 Estrutura de Pastas

```text
/
├── SetecApi/                   # API .NET 9 (Back-end)
│   ├── Program.cs             # Endpoints e Lógica de Banco
│   └── Dockerfile             # Configuração de Container
├── meu-formulario-logistica/   # App React (Front-end)
│   ├── src/App.jsx            # Interface e Integração
│   └── tailwind.config.js     # Configuração de Estilo
├── 1-Instalar_Tudo.bat         # Script de Instalação Local
└── 2-Rodar_Sistema.bat         # Script de Execução Local
```
🚀 Funcionalidades Principais
Para o Consultor:
Registro Completo: Campos detalhados para Aéreo, Carro, Ônibus, Táxi, Transfer e Hotel.

Multi-Perfil: Preenchimento simultâneo para o Especialista e para o Médico acompanhante.

Confirmação: Alerta de sucesso após gravação segura no banco de dados.

Para a Gestão (Beatriz/Cris):
Dashboard Admin: Visualização centralizada de todas as solicitações via URL especial.

Monitoramento de Status: Controle visual de pendências (OK / PENDENTE).

Exportação Pro: Botão para baixar a planilha Excel já formatada no padrão "Logística Cris".

🔗 Acesso Administrativo
Para acessar o painel de monitoramento e o botão de exportar Excel, utilize o parâmetro de segurança na URL:

https://formulario-setec.vercel.app/?admin=setec2026

🔧 Configuração de Ambiente (Deploy)
Back-end: Hospedado no Render via Docker. Variável de ambiente DATABASE_URL configurada para apontar para o Supabase.

Front-end: Hospedado na Vercel. Configurado para apontar para a URL da API no Render.

Banco de Dados: PostgreSQL configurado no Supabase com tabelas criadas via SQL Editor para garantir compatibilidade com o Pooler.

👤 Autor
Diogo Tognolli Desenvolvedor Júnior Back-End | PJ MEI Setec Consulting Group - 2026


---

### Como salvar:
1.  Crie um novo arquivo no seu VS Code chamado `README.md` na pasta principal do projeto.
2.  Cole o código acima.
3.  Salve, faça o **Commit** e o **Push** para o GitHub.

Seu repositório agora está com um nível de documentação de desenvolvedor Sênior! Alguma out
