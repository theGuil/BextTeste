## Experiência durante a execução do teste

Neste projeto, adotei inicialmente a criação das interfaces em TypeScript utilizando _type-safe_ em conjunto com a biblioteca **Zod**, com o objetivo de facilitar a construção dos demais módulos.

Para a simulação de APIs, utilizei a biblioteca **MSW**, garantindo um ambiente de desenvolvimento mais próximo do real, sem dependência de backend.

O gerenciamento de estado foi implementado com **Pinia**, estruturado dentro de uma classe com funções bem definidas e fortemente tipadas pelas interfaces, o que proporcionou maior organização, previsibilidade e facilidade de manutenção futura do projeto.

## Login para testes

email: bextteste@gmail.com
senha: 123456

## Link para acessar projeto em produção

https://bext-teste.navsoftware.com.br

## Setup

Instalar dependencias

```bash
npm install
```

## Start do projeto

Projeto rodara no url: http://localhost:3000

```bash
npm run dev
```

## Build

Comando Build para produção:

```bash
npm run build
```

## Preview

Preview do projeto:

```bash
npm run preview
```

## Estrutura do Projeto

O projeto está organizado da seguinte forma dentro da pasta `src`:

### 📁 src/contexto

Contém os Contextos (Context API) da aplicação.  
Aqui ficam os estados globais e regras de negócio compartilhadas entre componentes, como autenticação, tarefas, filtros, etc.

### 📁 src/componentes

Componentes reutilizáveis da interface (UI).  
Exemplos: botões, modais, drawers, formulários, listas, etc.  
Essa pasta concentra tudo que pode ser usado em mais de uma página.

### 📁 src/mocks

Arquivos de mock e configuração do MSW (Mock Service Worker).  
Utilizado para simular a API durante o desenvolvimento e testes, interceptando requisições HTTP.

### 📁 src/pages

Páginas da aplicação.  
Cada arquivo normalmente representa uma tela (ex: Login, Home, Tarefas, etc.) e utiliza os componentes e contextos.

### 📁 src/router

Configuração de rotas da aplicação.  
Define os caminhos (URLs), navegação entre páginas e proteção de rotas (ex: rotas privadas).

### 📁 src/types

Tipagens globais do projeto em TypeScript.  
Aqui ficam interfaces, types, enums e namespaces usados em vários pontos da aplicação, centralizando os contratos de dados.

# PADRÕES DE COMMIT UTILIZADOS NO PROJETO

🎉 start: Inicial  
📚 docs: Atualiza README  
🐛 fix: Corrige loop na 50  
✨ feat: Adiciona login  
💄 feat: Estiliza formulário  
🧱 ci: Modifica Dockerfile  
♻️ refactor: Refatora para arrow functions  
⚡ perf: Melhora resposta  
💥 fix: Reverte mudanças  
🧪 test: Adiciona teste  
💡 docs: Comenta função  
🗃️ raw: Adiciona dados RAW  
🧹 cleanup: Limpa validação  
🗑️ remove: Remove arquivos

Formato do commit:

git init
git add .
git commit -m "⚡ feat: "
git push -u origin producao
