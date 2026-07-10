# 👨‍🍳 Chef-in-a-box

![License](https://img.shields.io/github/license/Mariana-Azevedo/Chef-in-a-box)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![AdonisJS](https://img.shields.io/badge/AdonisJS-220052?style=for-the-badge&logo=AdonisJS&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**Chef-in-a-box** é um e-commerce inovador de ingredientes focado na praticidade na cozinha. A aplicação permite que o utilizador procure por receitas específicas e, com apenas alguns cliques, compre todos os ingredientes necessários para a preparar de uma única vez — com a flexibilidade de remover os itens que já possui em casa.

> 🎓 **Contexto Académico:** Este projeto foi idealizado e desenvolvido como parte dos requisitos práticos para a disciplina de **Programação Web** na **UFRRJ (Universidade Federal Rural do Rio de Janeiro)**.

## 💡 Sobre o Projeto

A ideia central do *Chef-in-a-box* é solucionar um problema comum: encontrar uma receita incrível, mas desanimar por ter que fazer uma lista de compras e procurar os ingredientes no supermercado. 

Integrado à [API Spoonacular](https://spoonacular.com/food-api), o sistema oferece um catálogo rico de receitas detalhadas. Ao escolher um prato, o sistema converte automaticamente a lista de ingredientes em produtos no carrinho de compras, transformando a experiência de cozinhar em algo fluido e sem stress.

## ✨ Principais Funcionalidades

* **Pesquisa Inteligente de Receitas:** Explore um vasto catálogo de pratos consumindo dados em tempo real da API Spoonacular.
* **Compra "One-Click" por Receita:** Adicione todos os ingredientes de uma receita ao carrinho instantaneamente.
* **Carrinho Personalizável:** Selecione e compre apenas o que realmente precisa, evitando desperdícios.
* **Autenticação e Checkout:** Navegue e construa o seu carrinho livremente como visitante. O login ou registo é exigido de forma estratégica apenas no momento de finalizar a compra.
* **Interface Moderna e Responsiva:** Navegação agradável e fluida construída com Tailwind CSS.

## 🚀 Tecnologias Utilizadas

A aplicação utiliza uma stack de desenvolvimento robusta, focada em produtividade e performance:

- **[AdonisJS](https://adonisjs.com/)** - Framework Node.js rápida e elegante, utilizada para o backend e estruturação MVC.
- **[EdgeJS](https://edgejs.dev/)** - Motor de templates utilizado pelo Adonis para a renderização limpa das views (SSR).
- **[TypeScript](https://www.typescriptlang.org/)** - Adiciona tipagem estática ao JavaScript, garantindo maior escalabilidade e redução de bugs.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS "utility-first" para uma estilização ágil diretamente nos templates Edge.
- **[Vite](https://vitejs.dev/)** - Ferramenta de build integrada para carregamento e compilação ultra-rápidos de assets de frontend.
- **SQLite** - Base de dados relacional leve, ideal para a gestão de utilizadores e persistência do carrinho no ambiente da aplicação.

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de possuir no seu ambiente de desenvolvimento:
* [Node.js](https://nodejs.org/en/) (Versão LTS recomendada)
* [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma chave de acesso (API Key) ativa do portal Spoonacular.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Mariana-Azevedo/Chef-in-a-box.git](https://github.com/Mariana-Azevedo/Chef-in-a-box.git)
   ```

2. **Aceda ao diretório do projeto:**
   ```bash
   cd Chef-in-a-box
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configuração de Variáveis de Ambiente:**
   Crie uma cópia do ficheiro de exemplo para o seu ambiente local e gere a chave do Adonis:
   ```bash
   cp .env.example .env
   node ace generate:key
   ```
   > **Aviso:** Abra o ficheiro `.env` gerado e insira a sua credencial da API Spoonacular. Certifique-se de que a ligação à base de dados (`DB_CONNECTION`) esteja configurada para `sqlite`.

5. **Configure a Base de Dados:**
   Execute as migrations para criar as tabelas de utilizadores e sessões no SQLite:
   ```bash
   node ace migration:run
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O servidor estará acessível por padrão no porto 3333 (http://localhost:3333).*

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).

---

Feito com ☕ por [Mariana Azevedo](https://github.com/Mariana-Azevedo).
