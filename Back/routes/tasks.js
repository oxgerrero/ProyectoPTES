// routes/tasks.js
const express = require('express');
const db = require('../db');
const Task = require('../models/task');

const router = express.Router();

// Crear una tarea
router.post('/', (req, res) => {
  const { name, estado } = req.body;
  const task = new Task(null, name, estado);
  
  db.run(`INSERT INTO tasks (name, estado) VALUES (?, ?)`, [task.name, task.estado], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ...task });
  });
});

// Leer todas las tareas
router.get('/', (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Actualizar una tarea
router.put('/:id', (req, res) => {
  const { name, estado } = req.body;
  const { id } = req.params;

  db.run(`UPDATE tasks SET name = ?, estado = ? WHERE id = ?`, [name, estado, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name, estado });
  });
});

// Eliminar una tarea
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM tasks WHERE id = ?`, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(`Se Elimino el registro: `,id)
    res.json("OK");
  });

});

module.exports = router;
