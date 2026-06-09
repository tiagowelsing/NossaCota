/**
 * Entidade Membro
 * Representa um integrante da república ou grupo de viagem.
 */
export class Membro {
  constructor(
    public readonly id: string,
    private nome: string,
    private email: string
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.nome || this.nome.trim() === "") {
      throw new Error("O nome do membro é obrigatório.");
    }
    if (!this.email || !this.email.includes("@")) {
      throw new Error("E-mail inválido.");
    }
  }

  public get getNome(): string {
    return this.nome;
  }

  public get getEmail(): string {
    return this.email;
  }
}
