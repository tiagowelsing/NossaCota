import { IGrupoRepository } from "../domain/IGrupoRepository";
import { GrupoRateio } from "../domain/GrupoRateio";

export class CriarGrupoUseCase {
  constructor(private grupoRepository: IGrupoRepository) {}

  async executar(id: string, nome: string): Promise<void> {
    const grupo = new GrupoRateio(id, nome);
    await this.grupoRepository.salvar(grupo);
  }
}
