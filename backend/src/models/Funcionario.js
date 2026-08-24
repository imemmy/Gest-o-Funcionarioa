// =====================================================
// MODEL
// Representa a entidade Funcionario dentro da aplicação.
// Não conhece HTTP nem SQL diretamente (isso é papel do
// Controller e do DAO, respectivamente).
// =====================================================
class Funcionario {
    constructor({ id, nome, email, cargo, telefone, cep, logradouro, bairro, cidade, estado }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cargo = cargo;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
    }

    // Validação básica de regra de negócio do domínio
    validar() {
        const erros = [];

        if (!this.nome || this.nome.trim().length < 3) {
            erros.push("Nome deve ter ao menos 3 caracteres.");
        }
        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            erros.push("E-mail inválido.");
        }
        if (!this.cargo) {
            erros.push("Cargo é obrigatório.");
        }
        if (!this.telefone || this.telefone.replace(/\D/g, "").length < 10) {
            erros.push("Telefone inválido.");
        }
        if (!this.cep || this.cep.replace(/\D/g, "").length !== 8) {
            erros.push("CEP inválido.");
        }

        return erros;
    }
}

module.exports = Funcionario;
