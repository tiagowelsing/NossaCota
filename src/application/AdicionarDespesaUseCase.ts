import { IGrupoRepository } from "../domain/IGrupoRepository";
import { Despesa } from "../domain/Despesa";
import { Dinheiro } from "../domain/Dinheiro";

export class AdicionarDespesaUseCase {
  constructor(private grupoRepository: IGrupoRepository) {}

  async executar(dados: {
    grupoId: string;
    despesaId: string;
    descricao: string;
    valor: number;
    pagadorId: string;
    participantesIds: string[];
  }): Promise<void> {
    const grupo = await this.grupoRepository.buscarPorId(dados.grupoId);
    if (!grupo) throw new Error("Grupo não encontrado.");

    const pagador = grupo.getMembros.find(m => m.id === dados.pagadorId);
    if (!pagador) throw new Error("Pagador não encontrado no grupo.");

    const participantes = grupo.getMembros.filter(m => dados.participantesIds.includes(m.id));
    if (participantes.length !== dados.participantesIds.length) {
      throw new Error("Um ou mais participantes não encontrados no grupo.");
    }

    const despesa = new Despesa(
      dados.despesaId,
      dados.descricao,
      Dinheiro.de(dados.valor),
      pagador,
      participantes
    );

    grupo.registrarDespesa(despesa);
    await this.grupoRepository.salvar(grupo);
  }
}
