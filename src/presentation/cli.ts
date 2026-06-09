import { Membro } from "../domain/Membro";
import { GrupoRateio } from "../domain/GrupoRateio";
import { AdicionarDespesaUseCase } from "../application/AdicionarDespesaUseCase";
import { CalcularSaldosUseCase } from "../application/CalcularSaldosUseCase";
import { InMemoryGrupoRepository } from "../infrastructure/InMemoryGrupoRepository";

/**
 * Script de Demonstração (CLI)
 * Simula o uso do sistema de ponta a ponta.
 */
async function bootstrap() {
  console.log("=== SISTEMA DE FINANÇAS COLETIVAS ===");

  // 1. Setup da Infraestrutura
  const repo = new InMemoryGrupoRepository();
  const addDespesa = new AdicionarDespesaUseCase(repo);
  const calcSaldos = new CalcularSaldosUseCase(repo);

  // 2. Criação do Grupo e Membros
  const grupo = new GrupoRateio("g1", "República dos Amigos");
  const tiago = new Membro("m1", "Tiago", "tiago@email.com");
  const alice = new Membro("m2", "Alice", "alice@email.com");
  const bob = new Membro("m3", "Bob", "bob@email.com");

  grupo.adicionarMembro(tiago);
  grupo.adicionarMembro(alice);
  grupo.adicionarMembro(bob);
  await repo.salvar(grupo);

  console.log(`Grupo '${grupo.nome}' criado com 3 membros.`);

  // 3. Adicionando Despesas
  console.log("\nRegistrando despesas...");
  
  // Tiago pagou 90 reais de internet para os 3
  await addDespesa.executar({
    grupoId: "g1",
    despesaId: "d1",
    descricao: "Internet",
    valor: 90,
    pagadorId: "m1",
    participantesIds: ["m1", "m2", "m3"]
  });

  // Alice pagou 60 reais de Pizza para ela e o Bob
  await addDespesa.executar({
    grupoId: "g1",
    despesaId: "d2",
    descricao: "Pizza",
    valor: 60,
    pagadorId: "m2",
    participantesIds: ["m2", "m3"]
  });

  // 4. Calculando Balanço Final (Clearing)
  console.log("\n--- BALANÇO FINAL (CLEARING) ---");
  const saldos = await calcSaldos.executar("g1");

  saldos.forEach((saldo, id) => {
    const membro = grupo.getMembros.find(m => m.id === id);
    if (saldo > 0) {
      console.log(`${membro?.getNome}: DEVE RECEBER R$ ${saldo.toFixed(2)}`);
    } else if (saldo < 0) {
      console.log(`${membro?.getNome}: DEVE PAGAR R$ ${Math.abs(saldo).toFixed(2)}`);
    } else {
      console.log(`${membro?.getNome}: ESTÁ QUITE.`);
    }
  });
}

bootstrap().catch(console.error);
