import sqlite3 from 'sqlite3';
import { IGrupoRepository } from '../domain/IGrupoRepository';
import { GrupoRateio } from '../domain/GrupoRateio';
import { Membro } from '../domain/Membro';
import { Despesa } from '../domain/Despesa';
import { Dinheiro } from '../domain/Dinheiro';

export class SQLiteGrupoRepository implements IGrupoRepository {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.inicializarTabelas();
  }

  private inicializarTabelas(): void {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS grupos (
        id TEXT PRIMARY KEY,
        nome TEXT
      )`);
      this.db.run(`CREATE TABLE IF NOT EXISTS membros (
        id TEXT PRIMARY KEY,
        nome TEXT,
        email TEXT,
        grupo_id TEXT,
        FOREIGN KEY(grupo_id) REFERENCES grupos(id)
      )`);
      this.db.run(`CREATE TABLE IF NOT EXISTS despesas (
        id TEXT PRIMARY KEY,
        descricao TEXT,
        valor REAL,
        pagador_id TEXT,
        grupo_id TEXT,
        FOREIGN KEY(pagador_id) REFERENCES membros(id),
        FOREIGN KEY(grupo_id) REFERENCES grupos(id)
      )`);
      this.db.run(`CREATE TABLE IF NOT EXISTS despesa_participantes (
        despesa_id TEXT,
        membro_id TEXT,
        PRIMARY KEY(despesa_id, membro_id),
        FOREIGN KEY(despesa_id) REFERENCES despesas(id),
        FOREIGN KEY(membro_id) REFERENCES membros(id)
      )`);
    });
  }

  async salvar(grupo: GrupoRateio): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('INSERT OR REPLACE INTO grupos (id, nome) VALUES (?, ?)', [grupo.id, grupo.nome]);
        
        // Salvar Membros
        for (const membro of grupo.getMembros) {
          this.db.run('INSERT OR REPLACE INTO membros (id, nome, email, grupo_id) VALUES (?, ?, ?, ?)', 
            [membro.id, membro.getNome, membro.getEmail, grupo.id]);
        }

        // Salvar Despesas
        for (const despesa of grupo.getDespesas) {
          this.db.run('INSERT OR REPLACE INTO despesas (id, descricao, valor, pagador_id, grupo_id) VALUES (?, ?, ?, ?, ?)',
            [despesa.id, despesa.id, despesa.getValorTotal.valorBruto, despesa.getPagador.id, grupo.id]);
          
          for (const participante of despesa.getParticipantes) {
            this.db.run('INSERT OR REPLACE INTO despesa_participantes (despesa_id, membro_id) VALUES (?, ?)',
              [despesa.id, participante.id]);
          }
        }
        resolve();
      });
    });
  }

  async buscarPorId(id: string): Promise<GrupoRateio | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM grupos WHERE id = ?', [id], async (err, row: any) => {
        if (err) return reject(err);
        if (!row) return resolve(undefined);

        const grupo = new GrupoRateio(row.id, row.nome);

        // Buscar Membros
        const membros = await this.buscarMembrosDoGrupo(id);
        membros.forEach(m => grupo.adicionarMembro(m));

        // Buscar Despesas
        const despesas = await this.buscarDespesasDoGrupo(id, membros);
        despesas.forEach(d => grupo.registrarDespesa(d));

        resolve(grupo);
      });
    });
  }

  private buscarMembrosDoGrupo(grupoId: string): Promise<Membro[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM membros WHERE grupo_id = ?', [grupoId], (err, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows.map(r => new Membro(r.id, r.nome, r.email)));
      });
    });
  }

  private async buscarDespesasDoGrupo(grupoId: string, membros: Membro[]): Promise<Despesa[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM despesas WHERE grupo_id = ?', [grupoId], async (err, rows: any[]) => {
        if (err) return reject(err);
        
        const despesas: Despesa[] = [];
        for (const r of rows) {
          const pagador = membros.find(m => m.id === r.pagador_id)!;
          const participantesIds = await this.buscarParticipantesDaDespesa(r.id);
          const participantes = membros.filter(m => participantesIds.includes(m.id));
          
          despesas.push(new Despesa(r.id, r.descricao, Dinheiro.de(r.valor), pagador, participantes));
        }
        resolve(despesas);
      });
    });
  }

  private buscarParticipantesDaDespesa(despesaId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT membro_id FROM despesa_participantes WHERE despesa_id = ?', [despesaId], (err, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows.map(r => r.membro_id));
      });
    });
  }
}
