import { IGrupoRepository } from "../domain/IGrupoRepository";
import { GrupoRateio } from "../domain/GrupoRateio";

export class ObterGrupoUseCase {
  constructor(private grupoRepository: IGrupoRepository) {}

  async executar(grupoId: string): Promise<GrupoRateio | undefined> {
    return await this.grupoRepository.buscarPorId(grupoId);
  }
}
