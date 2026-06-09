import { AdicionarDespesaUseCase } from "../src/application/AdicionarDespesaUseCase";
import { CalcularSaldosUseCase } from "../src/application/CalcularSaldosUseCase";
import { InMemoryGrupoRepository } from "../src/infrastructure/InMemoryGrupoRepository";
import { GrupoRateio } from "../src/domain/GrupoRateio";
import { Membro } from "../src/domain/Membro";

describe("Aplicação: Casos de Uso", () => {
  let repository: InMemoryGrupoRepository;
  let addDespesa: AdicionarDespesaUseCase;
  let calcSaldos: CalcularSaldosUseCase;

  beforeEach(async () => {
    repository = new InMemoryGrupoRepository();
    addDespesa = new AdicionarDespesaUseCase(repository);
    calcSaldos = new CalcularSaldosUseCase(repository);

    // Seed
    const grupo = new GrupoRateio("g1", "Grupo Teste");
    grupo.adicionarMembro(new Membro("m1", "Membro 1", "m1@test.com"));
    grupo.adicionarMembro(new Membro("m2", "Membro 2", "m2@test.com"));
    await repository.salvar(grupo);
  });

  it("deve adicionar uma despesa via caso de uso", async () => {
    await addDespesa.executar({
      grupoId: "g1",
      despesaId: "d1",
      descricao: "Aluguel",
      valor: 100,
      pagadorId: "m1",
      participantesIds: ["m1", "m2"]
    });

    const saldos = await calcSaldos.executar("g1");
    expect(saldos.get("m1")).toBe(50);
    expect(saldos.get("m2")).toBe(-50);
  });

  it("deve lançar erro para grupo inexistente", async () => {
    await expect(addDespesa.executar({
      grupoId: "inexistente",
      despesaId: "d1",
      descricao: "X",
      valor: 10,
      pagadorId: "m1",
      participantesIds: ["m1"]
    })).rejects.toThrow("Grupo não encontrado.");
  });
});
