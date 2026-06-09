import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { SQLiteGrupoRepository } from '../infrastructure/SQLiteGrupoRepository';
import { AdicionarDespesaUseCase } from '../application/AdicionarDespesaUseCase';
import { AdicionarMembroUseCase } from '../application/AdicionarMembroUseCase';
import { CalcularSaldosUseCase } from '../application/CalcularSaldosUseCase';
import { CriarGrupoUseCase } from '../application/CriarGrupoUseCase';
import { ObterGrupoUseCase } from '../application/ObterGrupoUseCase';

const app = express();
const port = 3000;

// Configuração do Repositório Real (SQLite)
const repo = new SQLiteGrupoRepository(path.join(__dirname, '../../nossacota.db'));

// Injeção de Dependências nos Casos de Uso
const criarGrupoUC = new CriarGrupoUseCase(repo);
const obterGrupoUC = new ObterGrupoUseCase(repo);
const addMembroUC = new AdicionarMembroUseCase(repo);
const addDespesaUC = new AdicionarDespesaUseCase(repo);
const calcSaldosUC = new CalcularSaldosUseCase(repo);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.get('/api/grupo/:id', async (req, res) => {
  try {
    const grupo = await obterGrupoUC.executar(req.params.id);
    if (!grupo) {
      // Se não existir, cria um padrão para facilitar o teste
      await criarGrupoUC.executar(req.params.id, "Grupo Principal");
      const novoGrupo = await obterGrupoUC.executar(req.params.id);
      return res.json(novoGrupo);
    }
    res.json(grupo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/membros', async (req, res) => {
  try {
    await addMembroUC.executar(req.body);
    res.status(201).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/despesas', async (req, res) => {
  try {
    await addDespesaUC.executar(req.body);
    res.status(201).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/grupo/:id/saldos', async (req, res) => {
  try {
    const saldos = await calcSaldosUC.executar(req.params.id);
    res.json(Object.fromEntries(saldos));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
