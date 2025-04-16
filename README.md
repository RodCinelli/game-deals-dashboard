# 🎮 Game Deals Dashboard

Um dashboard interativo para rastrear ofertas de jogos utilizando a CheapShark API, com foco em design moderno e experiência de usuário.

## 🎯 Sobre o Projeto

Este projeto é um desafio frontend que consiste em desenvolver um dashboard para visualizar ofertas de jogos de diferentes plataformas, utilizando a [CheapShark API](https://apidocs.cheapshark.com/).

## ⚙️ Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Axios

## 🚀 Funcionalidades

### 1. 🗃️ Data Table de Jogos

- Exibição dos jogos retornados pela API `/deals` em um data table
- A tabela contém:
  - Nome do jogo
  - Preço atual
  - Preço original
  - Porcentagem de desconto
  - Loja
  - Nota (Deal Rating)

### 2. 🎛️ Filtros e Selects

- Filtro por loja (storeID)
- Filtro por faixa de preço (lowerPrice e upperPrice)
- Filtro por porcentagem mínima de desconto
- Ordenação por:
  - Price
  - Savings
  - Deal Rating
- Campo de busca por título

### 3. 🔍 Modal de Detalhes

- Modal com detalhes adicionais ao clicar em um jogo:
  - Nome do jogo
  - Imagem maior
  - Preços (atual e original)
  - Loja
  - Histórico de menor preço (historicalLow)
  - Link para compra

### 4. 🧩 Componentização

- Componentes reutilizáveis organizados por pastas:
  - `<DataTable />`
  - `<GameModal />`
  - `<FilterSidebar />` ou `<FilterControls />`
  - `<Select />`, `<Input />`, `<PriceRange />`
  - `<GameCard />` (visualização alternativa)

### 5. 💅 Design e UX

- Layout moderno e responsivo
- Modais e transições suaves
- Feedback visual para elementos interativos
- Tema escuro/claro

## 🧠 Extras (Diferenciais)

- Scroll infinito ou paginação
- Salvamento de favoritos com localStorage/cookies
- Skeleton loaders
- Toggle para alternar entre modo tabela e modo cards

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm run dev
   ```

## 📝 API Utilizada

O projeto utiliza a [CheapShark API](https://apidocs.cheapshark.com/) para obter informações sobre ofertas de jogos em diferentes plataformas e lojas.
