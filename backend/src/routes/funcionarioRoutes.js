// =====================================================
// ROTAS
// Mapeia os endpoints HTTP para os métodos do Controller.
// =====================================================
const express = require("express");
const router = express.Router();
const funcionarioController = require("../controllers/FuncionarioController");

router.get("/funcionarios", (req, res) => funcionarioController.listar(req, res));
router.get("/funcionarios/:id", (req, res) => funcionarioController.buscarPorId(req, res));
router.post("/funcionarios", (req, res) => funcionarioController.criar(req, res));
router.put("/funcionarios/:id", (req, res) => funcionarioController.atualizar(req, res));
router.delete("/funcionarios/:id", (req, res) => funcionarioController.remover(req, res));

module.exports = router;
