import { IGrupoRepository } from "../domain/IGrupoRepository";

export class CalcularSaldosUseCase {
  constructor(private grupoRepository: IGrupoRepository) {}

  async executar(grupoId: string): Promise<Map<string, number>> {
    const grupo = await this.grupoRepository.buscarPorId(grupoId);
    if (!grupo) throw new Error("Grupo não encontrado.");

    return grupo.calcularSaldos();
  }
}
