// =====================================================
// DAO (Data Access Object)
// Única camada que conversa diretamente com o Banco de
// Dados. Todo o SQL da aplicação fica concentrado aqui,
// isolando o restante do sistema dos detalhes de acesso
// a dados (equivalente ao padrão DAO usado com JDBC).
// =====================================================
const pool = require("../config/db");

class FuncionarioDAO {
    // CREATE
    async inserir(funcionario) {
        const sql = `
            INSERT INTO funcionarios
                (nome, email, cargo, telefone, cep, logradouro, bairro, cidade, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            funcionario.nome,
            funcionario.email,
            funcionario.cargo,
            funcionario.telefone,
            funcionario.cep,
            funcionario.logradouro || null,
            funcionario.bairro || null,
            funcionario.cidade || null,
            funcionario.estado || null,
        ];

        const [resultado] = await pool.query(sql, valores);
        return this.buscarPorId(resultado.insertId);
    }

    // READ (todos)
    async listarTodos() {
        const [linhas] = await pool.query(
            "SELECT * FROM funcionarios ORDER BY id DESC"
        );
        return linhas;
    }

    // READ (por id)
    async buscarPorId(id) {
        const [linhas] = await pool.query(
            "SELECT * FROM funcionarios WHERE id = ?",
            [id]
        );
        return linhas[0] || null;
    }

    // UPDATE
    async atualizar(id, funcionario) {
        const sql = `
            UPDATE funcionarios
            SET nome = ?, email = ?, cargo = ?, telefone = ?, cep = ?,
                logradouro = ?, bairro = ?, cidade = ?, estado = ?
            WHERE id = ?
        `;
        const valores = [
            funcionario.nome,
            funcionario.email,
            funcionario.cargo,
            funcionario.telefone,
            funcionario.cep,
            funcionario.logradouro || null,
            funcionario.bairro || null,
            funcionario.cidade || null,
            funcionario.estado || null,
            id,
        ];

        const [resultado] = await pool.query(sql, valores);
        if (resultado.affectedRows === 0) return null;
        return this.buscarPorId(id);
    }

    // DELETE
    async remover(id) {
        const [resultado] = await pool.query(
            "DELETE FROM funcionarios WHERE id = ?",
            [id]
        );
        return resultado.affectedRows > 0;
    }

    // Verifica duplicidade de e-mail (regra de negócio auxiliar)
    async buscarPorEmail(email, ignorarId = null) {
        let sql = "SELECT id FROM funcionarios WHERE email = ?";
        const params = [email];
        if (ignorarId) {
            sql += " AND id <> ?";
            params.push(ignorarId);
        }
        const [linhas] = await pool.query(sql, params);
        return linhas[0] || null;
    }
}

module.exports = new FuncionarioDAO();
