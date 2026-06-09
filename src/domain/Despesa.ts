import { Dinheiro } from "./Dinheiro";
import { Membro } from "./Membro";

/**
 * Entidade Despesa
 * Registra um gasto, quem pagou e quem participa do rateio.
 */
export class Despesa {
  constructor(
    public readonly id: string,
    private descricao: string,
    private valorTotal: Dinheiro,
    private pagador: Membro,
    private participantes: Membro[]
  ) {
    if (participantes.length === 0) {
      throw new Error("Uma despesa deve ter pelo menos um participante.");
    }
  }

  public get getValorTotal(): Dinheiro {
    return this.valorTotal;
  }

  public get getPagador(): Membro {
    return this.pagador;
  }

  public get getParticipantes(): Membro[] {
    return [...this.participantes];
  }

  /**
   * Calcula quanto cada participante deve pagar.
   */
  public calcularRateio(): Dinheiro {
    return this.valorTotal.dividir(this.participantes.length);
  }
}
