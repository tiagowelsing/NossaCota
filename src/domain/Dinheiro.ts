/**
 * Value Object Dinheiro
 * Representa um valor monetário de forma imutável e precisa.
 */
export class Dinheiro {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = Math.round(valor * 100) / 100; // Garante precisão de 2 casas decimais
  }

  public static de(valor: number): Dinheiro {
    if (valor < 0) {
      throw new Error("O valor monetário não pode ser negativo.");
    }
    return new Dinheiro(valor);
  }

  public get valorBruto(): number {
    return this.valor;
  }

  public somar(outro: Dinheiro): Dinheiro {
    return new Dinheiro(this.valor + outro.valor);
  }

  public subtrair(outro: Dinheiro): Dinheiro {
    const resultado = this.valor - outro.valor;
    if (resultado < 0) {
      throw new Error("Saldo resultante não pode ser negativo.");
    }
    return new Dinheiro(resultado);
  }

  public dividir(partes: number): Dinheiro {
    if (partes <= 0) {
      throw new Error("Divisão deve ser por um número positivo.");
    }
    return new Dinheiro(this.valor / partes);
  }

  public equals(outro: Dinheiro): boolean {
    return this.valor === outro.valor;
  }
}
