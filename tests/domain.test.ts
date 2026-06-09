import { Dinheiro } from "../src/domain/Dinheiro";
import { Membro } from "../src/domain/Membro";
import { Despesa } from "../src/domain/Despesa";
import { GrupoRateio } from "../src/domain/GrupoRateio";

describe("Domínio: Finanças Coletivas", () => {
  describe("Dinheiro (Value Object)", () => {
    it("deve criar um valor monetário e garantir 2 casas decimais", () => {
      const d = Dinheiro.de(10.555);
      expect(d.valorBruto).toBe(10.56);
    });

    it("deve somar dois valores corretamente", () => {
      const d1 = Dinheiro.de(10.50);
      const d2 = Dinheiro.de(5.25);
      expect(d1.somar(d2).valorBruto).toBe(15.75);
    });

    it("deve lançar erro para valores negativos", () => {
      expect(() => Dinheiro.de(-1)).toThrow("O valor monetário não pode ser negativo.");
    });
  });

  describe("Membro (Entidade)", () => {
    it("deve criar um membro válido", () => {
      const m = new Membro("1", "João", "joao@email.com");
      expect(m.getNome).toBe("João");
    });

    it("deve validar e-mail", () => {
      expect(() => new Membro("1", "João", "emailinvalido")).toThrow("E-mail inválido.");
    });
  });

  describe("Despesa e GrupoRateio", () => {
    let m1: Membro, m2: Membro, m3: Membro;
    let grupo: GrupoRateio;

    beforeEach(() => {
      m1 = new Membro("m1", "Membro 1", "m1@test.com");
      m2 = new Membro("m2", "Membro 2", "m2@test.com");
      m3 = new Membro("m3", "Membro 3", "m3@test.com");
      grupo = new GrupoRateio("g1", "Grupo Teste");
      grupo.adicionarMembro(m1);
      grupo.adicionarMembro(m2);
      grupo.adicionarMembro(m3);
    });

    it("deve calcular o clearing corretamente", () => {
      // Membro 1 pagou 90, dividido por 3 (M1, M2, M3)
      // M1 pagou 90, deve 30 -> Saldo +60
      // M2 pagou 0, deve 30 -> Saldo -30
      // M3 pagou 0, deve 30 -> Saldo -30
      const d1 = new Despesa("d1", "Conta 1", Dinheiro.de(90), m1, [m1, m2, m3]);
      grupo.registrarDespesa(d1);

      const saldos = grupo.calcularSaldos();
      expect(saldos.get("m1")).toBe(60);
      expect(saldos.get("m2")).toBe(-30);
      expect(saldos.get("m3")).toBe(-30);
    });

    it("deve lançar erro se o pagador não for do grupo", () => {
      const estranho = new Membro("ex", "Estranho", "e@test.com");
      const d = new Despesa("d", "X", Dinheiro.de(10), estranho, [m1]);
      expect(() => grupo.registrarDespesa(d)).toThrow("O pagador não pertence ao grupo.");
    });
  });
});
