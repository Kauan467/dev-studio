<div align="center">

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

<br/><br/>

```
██████╗ ███████╗██╗   ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
██╔══██╗██╔════╝██║   ██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
██║  ██║█████╗  ██║   ██║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
██████╔╝███████╗ ╚████╔╝     ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
╚═════╝ ╚══════╝  ╚═══╝      ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
```

### Seu segundo cérebro de desenvolvedor

*Salve, organize e encontre seus snippets de código*

<br/>

[![GitHub stars](https://img.shields.io/github/stars/Kauan467/dev-studio?style=flat-square&color=7c3aed)](https://github.com/Kauan467/dev-studio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Kauan467/dev-studio?style=flat-square&color=7c3aed)](https://github.com/Kauan467/dev-studio/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Kauan467/dev-studio?style=flat-square&color=7c3aed)](https://github.com/Kauan467/dev-studio/issues)
[![License](https://img.shields.io/github/license/Kauan467/dev-studio?style=flat-square&color=7c3aed)](LICENSE)

</div>

---

## 📌 Sobre o projeto

**Dev Studio** é uma aplicação web para desenvolvedores que precisam organizar seus trechos de código mais úteis.

> *"Você não precisa lembrar de tudo. Você só precisa saber onde encontrar."*

---

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login e cadastro de conta com segurança
- 📋 **Gerenciamento de Snippets** - Crie, edite, visualize e delete seus snippets
- ⭐ **Favoritos** - Marque os snippets mais importantes para acesso rápido
- 🔒 **Privacidade** - Defina snippets como privados ou públicos
- 🔗 **Compartilhamento** — Gere um link para compartilhar um snippet com qualquer pessoa, mesmo sem conta
- 🏷️ **Tags** - Adicione tags personalizadas para organização
- 🌐 **Filtro por Linguagem** - Navegue por Java, JavaScript, TypeScript, MongoDB, Spring Boot, SQL e muito mais
- 🔍 **Busca** - Encontre qualquer snippet instantaneamente
- 📅 **Ordenação** - Ordene por mais recente ou outros critérios
- 🎨 **Syntax Highlighting** - Visualize o código com realce de sintaxe

---

## 🖥️ Screenshots

### Tela de Login
![Login](https://github.com/user-attachments/assets/8cd5c920-d156-4c5f-a93b-f80b2ab8ac23)

### Dashboard — Meus Snippets
![Dashboard](https://github.com/user-attachments/assets/24aac64d-bc43-4573-be59-75dfee5184c5)

### Visualização de Snippet
![Visualização](https://github.com/user-attachments/assets/28508c83-3da5-4c0a-9b39-dec102223f29)

### Criação de Snippet
<div align="center">
  <img src="https://github.com/user-attachments/assets/306ac6a1-1a9d-443c-9d02-56c6e11fb320" width="450" />
</div>

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Banco de Dados | PostgreSQL |
| Linguagem | JavaScript |

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Kauan467/dev-studio.git

# Entre na pasta do projeto
cd dev-studio

# Instale as dependências
npm install
```

### Configuração do banco de dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/devstudio"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

### Rodando o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura do projeto

```
dev-studio/
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── src/
│   ├── app/                # Rotas e páginas (Next.js App Router)
│   ├── components/         # Componentes reutilizáveis
│   └── lib/                # Utilitários e configurações
├── .gitignore
├── jsconfig.json
├── package.json
└── README.md
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 👤 Autor

**Kauan** - [@Kauan467](https://github.com/Kauan467)

---

<div align="center">
  <sub>Feito com ☕ para devs que odeiam procurar código em projetos antigos.</sub>
</div>
