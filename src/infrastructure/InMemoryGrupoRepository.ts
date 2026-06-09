import { IGrupoRepository } from "../domain/IGrupoRepository";
import { GrupoRateio } from "../domain/GrupoRateio";

export class InMemoryGrupoRepository implements IGrupoRepository {
  private grupos: Map<string, GrupoRateio> = new Map();

  async salvar(grupo: GrupoRateio): Promise<void> {
    this.grupos.set(grupo.id, grupo);
  }

  async buscarPorId(id: string): Promise<GrupoRateio | undefined> {
    return this.grupos.get(id);
  }
}
