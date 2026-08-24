// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================
const API_URL = "http://localhost:3000/api/funcionarios";

const formulario = document.getElementById("formularioFuncionario");
const funcionarioId = document.getElementById("funcionarioId");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const cargo = document.getElementById("cargo");
const telefone = document.getElementById("telefone");
const cep = document.getElementById("cep");
const logradouro = document.getElementById("logradouro");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const mensagem = document.getElementById("mensagem");
const statusCep = document.getElementById("statusCep");
const statusLista = document.getElementById("statusLista");
const corpoTabela = document.getElementById("corpoTabela");
const tituloFormulario = document.getElementById("tituloFormulario");
const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelar = document.getElementById("botaoCancelar");

// =====================================================
// ELEMENTOS DAS MENSAGENS DE ERRO
// =====================================================
const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroCargo = document.getElementById("erroCargo");
const erroTelefone = document.getElementById("erroTelefone");
const erroCep = document.getElementById("erroCep");

// =====================================================
// CARREGA A LISTA AO ABRIR A PÁGINA
// =====================================================
document.addEventListener("DOMContentLoaded", carregarFuncionarios);

// =====================================================
// READ - LISTAR FUNCIONÁRIOS (GET)
// =====================================================
async function carregarFuncionarios() {
    statusLista.textContent = "Carregando funcionários...";
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Falha ao buscar funcionários.");

        const funcionarios = await resposta.json();
        renderizarTabela(funcionarios);
        statusLista.textContent = "";
    } catch (erro) {
        console.error(erro);
        statusLista.textContent =
            "Não foi possível carregar a lista. Verifique se o servidor está rodando.";
    }
}

function renderizarTabela(funcionarios) {
    corpoTabela.innerHTML = "";

    if (funcionarios.length === 0) {
        corpoTabela.innerHTML =
            `<tr><td colspan="6">Nenhum funcionário cadastrado.</td></tr>`;
        return;
    }

    funcionarios.forEach((f) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${escaparHtml(f.nome)}</td>
            <td>${escaparHtml(f.email)}</td>
            <td>${escaparHtml(f.cargo)}</td>
            <td>${escaparHtml(f.telefone)}</td>
            <td>${escaparHtml(f.cidade || "")}/${escaparHtml(f.estado || "")}</td>
            <td class="colunaAcoes">
                <button type="button" class="botaoEditar" data-id="${f.id}">Editar</button>
                <button type="button" class="botaoExcluir" data-id="${f.id}">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });

    // Liga os eventos dos botões recém-criados
    document.querySelectorAll(".botaoEditar").forEach((botao) =>
        botao.addEventListener("click", () => iniciarEdicao(botao.dataset.id))
    );
    document.querySelectorAll(".botaoExcluir").forEach((botao) =>
        botao.addEventListener("click", () => excluirFuncionario(botao.dataset.id))
    );
}

function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

// =====================================================
// UPDATE - CARREGAR DADOS NO FORMULÁRIO PARA EDIÇÃO
// =====================================================
async function iniciarEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error("Funcionário não encontrado.");

        const f = await resposta.json();

        funcionarioId.value = f.id;
        nome.value = f.nome;
        email.value = f.email;
        cargo.value = f.cargo;
        telefone.value = f.telefone;
        cep.value = f.cep;
        logradouro.value = f.logradouro || "";
        bairro.value = f.bairro || "";
        cidade.value = f.cidade || "";
        estado.value = f.estado || "";

        tituloFormulario.textContent = "Editar Funcionário";
        botaoSalvar.textContent = "Salvar Alterações";
        botaoCancelar.hidden = false;

        formulario.scrollIntoView({ behavior: "smooth" });
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível carregar os dados para edição.";
    }
}

// =====================================================
// CANCELAR EDIÇÃO
// =====================================================
botaoCancelar.addEventListener("click", resetarFormulario);

function resetarFormulario() {
    formulario.reset();
    funcionarioId.value = "";
    tituloFormulario.textContent = "Cadastro de Funcionário";
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
    mensagem.textContent = "";
    statusCep.textContent = "";
}

// =====================================================
// DELETE - EXCLUIR FUNCIONÁRIO
// =====================================================
async function excluirFuncionario(id) {
    const confirmar = window.confirm(
        "Tem certeza que deseja excluir este funcionário?"
    );
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!resposta.ok && resposta.status !== 204) {
            throw new Error("Falha ao excluir.");
        }

        await carregarFuncionarios();
        mensagem.textContent = "Funcionário excluído com sucesso!";

        // Se o funcionário excluído estava sendo editado, reseta o formulário
        if (funcionarioId.value === String(id)) {
            resetarFormulario();
        }
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível excluir o funcionário.";
    }
}

// =====================================================
// VALIDAÇÃO DO FORMULÁRIO (client-side)
// =====================================================
function validarFormulario() {
    let formularioValido = true;
    erroNome.textContent = "";
    erroEmail.textContent = "";
    erroCargo.textContent = "";
    erroTelefone.textContent = "";
    erroCep.textContent = "";
    mensagem.textContent = "";

    if (nome.value.trim().length < 3) {
        erroNome.textContent = "Informe o nome completo.";
        formularioValido = false;
    }

    if (!email.validity.valid) {
        erroEmail.textContent = "Informe um e-mail válido.";
        formularioValido = false;
    }

    if (cargo.value === "") {
        erroCargo.textContent = "Selecione um cargo.";
        formularioValido = false;
    }

    const telefoneNumeros = telefone.value.replace(/\D/g, "");
    if (telefoneNumeros.length < 10) {
        erroTelefone.textContent = "Informe um telefone válido.";
        formularioValido = false;
    }

    const cepNumeros = cep.value.replace(/\D/g, "");
    if (cepNumeros.length !== 8) {
        erroCep.textContent = "Informe um CEP válido.";
        formularioValido = false;
    }

    return formularioValido;
}

// =====================================================
// MÁSCARA DO TELEFONE
// =====================================================
telefone.addEventListener("input", function () {
    let valor = telefone.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    }
    telefone.value = valor;
});

// =====================================================
// MÁSCARA DO CEP
// =====================================================
cep.addEventListener("input", function () {
    let valor = cep.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.substring(0, 8);
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + "-" + valor.substring(5);
    }
    cep.value = valor;
});

// =====================================================
// BUSCA ASSÍNCRONA DO CEP (ViaCEP)
// =====================================================
cep.addEventListener("blur", buscarCep);

async function buscarCep() {
    const cepNumeros = cep.value.replace(/\D/g, "");
    if (cepNumeros.length !== 8) return;

    statusCep.textContent = "Consultando endereço...";
    erroCep.textContent = "";

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        if (!resposta.ok) throw new Error("Erro na requisição.");

        const dados = await resposta.json();

        if (dados.erro) {
            statusCep.textContent = "";
            erroCep.textContent = "CEP não encontrado.";
            limparEndereco();
            return;
        }

        logradouro.value = dados.logradouro || "";
        bairro.value = dados.bairro || "";
        cidade.value = dados.localidade || "";
        estado.value = dados.uf || "";

        statusCep.textContent = "Endereço encontrado!";
    } catch (erro) {
        statusCep.textContent = "";
        erroCep.textContent = "Não foi possível consultar o CEP.";
        limparEndereco();
    }
}

function limparEndereco() {
    logradouro.value = "";
    bairro.value = "";
    cidade.value = "";
    estado.value = "";
}

// =====================================================
// EVENTO DE ENVIO DO FORMULÁRIO (CREATE / UPDATE)
// =====================================================
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const valido = validarFormulario();
    if (!valido) {
        mensagem.textContent = "Corrija os campos indicados antes de continuar.";
        return;
    }

    const dadosFuncionario = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        cargo: cargo.value,
        telefone: telefone.value,
        cep: cep.value,
        logradouro: logradouro.value,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
    };

    const idAtual = funcionarioId.value;
    const emEdicao = Boolean(idAtual);

    try {
        const resposta = await fetch(
            emEdicao ? `${API_URL}/${idAtual}` : API_URL,
            {
                method: emEdicao ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosFuncionario),
            }
        );

        const dadosResposta = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            mensagem.textContent =
                dadosResposta.mensagem || "Não foi possível salvar o funcionário.";
            return;
        }

        mensagem.textContent = emEdicao
            ? "Funcionário atualizado com sucesso!"
            : "Funcionário cadastrado com sucesso!";

        resetarFormulario();
        await carregarFuncionarios();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent =
            "Erro de conexão com o servidor. Verifique se a API está rodando.";
    }
});
