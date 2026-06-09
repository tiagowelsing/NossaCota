# Aplicativo de Finanças Coletivas

Este projeto é o Núcleo de Domínio (Core Domain) de uma aplicação de finanças coletivas para repúblicas ou grupos de viagem, desenvolvido como parte da disciplina de Orientação a Objetos.

## O Problema
Divisão de despesas comuns de forma justa. O sistema registra gastos individuais, calcula quem deve para quem e gerencia o fundo de reserva do grupo.

## Requisitos Técnicos
- **Orientação a Objetos (OO) Avançada**: Encapsulamento, herança/composição, polimorfismo e alta coesão.
- **Domain-Driven Design (DDD)**: Entidades, Value Objects e Agregados.
- **Test-Driven Development (TDD)**: Desenvolvimento guiado por testes.
- **CI/CD com GitHub Actions**: Pipeline automatizada para build e testes.

## Estrutura do Projeto
- `src/domain/`: Regras de negócio, Entidades, Value Objects e Agregados.
- `src/application/`: Casos de uso e serviços da aplicação.
- `src/infrastructure/`: Repositórios e adaptadores externos.
- `src/presentation/`: Interface gráfica (Bônus).
- `tests/`: Testes unitários.

## Como Executar
1. Instale as dependências: `npm install`
2. Execute os testes: `npm test`
