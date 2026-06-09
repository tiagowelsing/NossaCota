import { IGrupoRepository } from "../domain/IGrupoRepository";
import { Membro } from "../domain/Membro";

export class AdicionarMembroUseCase {
  constructor(private grupoRepository: IGrupoRepository) {}

  async executar(dados: {
    grupoId: string;
    membroId: string;
    nome: string;
    email: string;
  }): Promise<void> {
    const grupo = await this.grupoRepository.buscarPorId(dados.grupoId);
    if (!grupo) throw new Error("Grupo não encontrado.");

    const novoMembro = new Membro(dados.membroId, dados.nome, dados.email);
    grupo.adicionarMembro(novoMembro);
    
    await this.grupoRepository.salvar(grupo);
  }
}
