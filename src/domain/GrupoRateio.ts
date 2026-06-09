import { Despesa } from "./Despesa";
import { Membro } from "./Membro";

/**
 * Aggregate Root GrupoRateio
 * Gerencia os membros, despesas e executa o cálculo de Clearing.
 */
export class GrupoRateio {
  private membros: Membro[] = [];
  private despesas: Despesa[] = [];

  constructor(public readonly id: string, public readonly nome: string) {}

  public adicionarMembro(membro: Membro): void {
    if (this.membros.find((m) => m.id === membro.id)) {
      throw new Error("Membro já cadastrado no grupo.");
    }
    this.membros.push(membro);
  }

  public registrarDespesa(despesa: Despesa): void {
    this.validarMembrosDaDespesa(despesa);
    this.despesas.push(despesa);
  }

  private validarMembrosDaDespesa(despesa: Despesa): void {
    const todosMembrosIds = this.membros.map((m) => m.id);
    
    if (!todosMembrosIds.includes(despesa.getPagador.id)) {
      throw new Error("O pagador não pertence ao grupo.");
    }

    for (const participante of despesa.getParticipantes) {
      if (!todosMembrosIds.includes(participante.id)) {
        throw new Error(`O participante ${participante.getNome} não pertence ao grupo.`);
      }
    }
  }

  /**
   * Cálculo de Clearing (Balanço Final)
   * Retorna um mapa com o saldo de cada membro:
   * Positivo: Deve receber
   * Negativo: Deve pagar
   */
  public calcularSaldos(): Map<string, number> {
    const saldos = new Map<string, number>();

    // Inicializa saldos com zero para todos os membros
    for (const membro of this.membros) {
      saldos.set(membro.id, 0);
    }

    // Processa cada despesa para ajustar os saldos
    for (const despesa of this.despesas) {
      const pagadorId = despesa.getPagador.id;
      const valorTotal = despesa.getValorTotal.valorBruto;
      const valorRateio = despesa.calcularRateio().valorBruto;

      // O pagador "ganha" o crédito total do que pagou
      saldos.set(pagadorId, (saldos.get(pagadorId) || 0) + valorTotal);

      // Cada participante "perde" sua parte do rateio
      for (const participante of despesa.getParticipantes) {
        const pId = participante.id;
        saldos.set(pId, (saldos.get(pId) || 0) - valorRateio);
      }
    }

    return saldos;
  }

  public get getMembros(): Membro[] {
    return [...this.membros];
  }

  public get getDespesas(): Despesa[] {
    return [...this.despesas];
  }
}
