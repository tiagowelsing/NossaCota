import { GrupoRateio } from "./GrupoRateio";

export interface IGrupoRepository {
  salvar(grupo: GrupoRateio): Promise<void>;
  buscarPorId(id: string): Promise<GrupoRateio | undefined>;
}
