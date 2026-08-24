// =====================================================
// CONTROLLER
// Responsável por tratar as requisições e respostas HTTP,
// orquestrando Model (regras/validação) e DAO (persistência).
// Não contém SQL nem lógica de acesso a dados diretamente.
// =====================================================
const Funcionario = require("../models/Funcionario");
const funcionarioDAO = require("../dao/FuncionarioDAO");

class FuncionarioController {
    // GET /api/funcionarios
    async listar(req, res) {
        try {
            const funcionarios = await funcionarioDAO.listarTodos();
            return res.status(200).json(funcionarios);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro ao listar funcionários." });
        }
    }

    // GET /api/funcionarios/:id
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await funcionarioDAO.buscarPorId(id);

            if (!funcionario) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }
            return res.status(200).json(funcionario);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro ao buscar funcionário." });
        }
    }

    // POST /api/funcionarios
    async criar(req, res) {
        try {
            const funcionario = new Funcionario(req.body);
            const erros = funcionario.validar();

            if (erros.length > 0) {
                return res.status(400).json({ mensagem: "Dados inválidos.", erros });
            }

            const existente = await funcionarioDAO.buscarPorEmail(funcionario.email);
            if (existente) {
                return res.status(409).json({ mensagem: "Já existe um funcionário com este e-mail." });
            }

            const novoFuncionario = await funcionarioDAO.inserir(funcionario);
            return res.status(201).json(novoFuncionario);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro ao cadastrar funcionário." });
        }
    }

    // PUT /api/funcionarios/:id
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const funcionario = new Funcionario(req.body);
            const erros = funcionario.validar();

            if (erros.length > 0) {
                return res.status(400).json({ mensagem: "Dados inválidos.", erros });
            }

            const existente = await funcionarioDAO.buscarPorEmail(funcionario.email, id);
            if (existente) {
                return res.status(409).json({ mensagem: "Já existe outro funcionário com este e-mail." });
            }

            const atualizado = await funcionarioDAO.atualizar(id, funcionario);
            if (!atualizado) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }
            return res.status(200).json(atualizado);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro ao atualizar funcionário." });
        }
    }

    // DELETE /api/funcionarios/:id
    async remover(req, res) {
        try {
            const { id } = req.params;
            const removido = await funcionarioDAO.remover(id);

            if (!removido) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }
            return res.status(204).send();
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro ao remover funcionário." });
        }
    }
}

module.exports = new FuncionarioController();
