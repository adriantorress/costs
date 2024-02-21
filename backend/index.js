require('express-async-errors');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const ApplicationError = require('./src/errors')

const app = express();
const port = 5000;

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'http://34.42.97.42',
  user: 'project-costs',
  password: 'project-costs',
  database: 'db_costs',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

app.use(cors());


// Middleware para análise do corpo da solicitação
app.use(bodyParser.json());

// Rotas
app.get('/projects', (req, res) => {
  const query = 'SELECT p.*, c.name category_name FROM PROJECT p, CATEGORY c WHERE p.category_id = c.id';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json({ projects: results });
  });
});

app.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const query = `SELECT p.*, JSON_ARRAYAGG(JSON_OBJECT('id',s.id,'name',s.name,'description',s.description,'value',s.value)) as services FROM PROJECT p LEFT JOIN service s on s.project_id = p.id WHERE p.id = ?`;

  db.query(query, [projectId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let project = results[0];
    if (project?.services) project.services = JSON.parse(project.services);
    res.json({ project });
  });
});


app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM CATEGORY';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json({ categories: results });
  });
});


app.post('/projects', (req, res, next) => {
  const { name, category_id, budget } = req.body;
  const query = 'INSERT INTO PROJECT (name, category_id, budget) VALUES (?, ?, ?)';
  db.query(query, [name, category_id, budget], (err, results) => {
    if (err) {
      return next(err); // Chama o próximo middleware de erro
    } else {
      res.json({ id: results.insertId, name, category_id, budget });
    }
  });
});

app.delete('/projects/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM PROJECT WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.status(200).json({
        success: true
      });
    }
  });
});

app.patch('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const { name, category_id, budget } = req.body;
  const query = 'UPDATE PROJECT SET name=?, category_id=?, budget=? WHERE id=?';
  db.query(query, [name, category_id, budget, projectId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.json({ id: projectId, name, category_id, budget });
    }
  });
});

app.post('/projects/:id/services', (req, res) => {
  const projectId = req.params.id;
  const { name, description, cost } = req.body;
  const query = 'INSERT INTO SERVICE (name, description, cost, project_id) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, cost, projectId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.json({ id: results.insertId, name, description, cost });
    }
  });
});


// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://34.42.97.42:${port}`);
});
