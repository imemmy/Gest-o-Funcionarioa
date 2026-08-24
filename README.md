# Sistema de Gestão de Funcionários — CRUD com MVC + DAO

Aplicação web completa para cadastro, consulta, edição e exclusão de
funcionários, com integração ao ViaCEP para preenchimento automático de
endereço. O back-end segue o padrão **MVC** com camada **DAO** dedicada ao
acesso ao banco de dados relacional.

## Arquitetura

```
projeto/
├── database.sql              # Script de criação do banco (MySQL)
├── backend/                  # API REST (MVC + DAO)
│   ├── server.js             # Ponto de entrada / configuração do Express
│   ├── .env.example          # Modelo de variáveis de ambiente
│   └── src/
│       ├── config/db.js      # Pool de conexão com o MySQL
│       ├── models/           # Model — entidade e regras de validação
│       ├── dao/               # DAO — todo o SQL da aplicação
│       ├── controllers/       # Controller — trata requisições/respostas HTTP
│       └── routes/            # Mapeamento das rotas da API
└── frontend/                 # View — HTML, CSS e JS puro consumindo a API
    ├── index.html
    ├── style.css
    └── script.js
```

**Fluxo MVC:**
`Rota → Controller (HTTP) → Model (validação) → DAO (SQL) → Banco de Dados`

## Tecnologias

- **Back-end:** Node.js, Express
- **Banco de dados:** MySQL (via `mysql2`, com pool de conexões)
- **Front-end:** HTML5, CSS3, JavaScript (Fetch API)
- **Integração externa:** API ViaCEP (busca de endereço por CEP)

## Pré-requisitos

- Node.js 18+ instalado
- MySQL 8+ instalado e em execução

## Como executar

### 1. Criar o banco de dados

No MySQL, execute o script de criação:

```bash
mysql -u root -p < database.sql
```

Isso cria o banco `gestao_funcionarios`, a tabela `funcionarios` e insere
dois registros de exemplo.

### 2. Configurar e rodar o back-end

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do seu MySQL:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=gestao_funcionarios
PORT=3000
```

Inicie o servidor:

```bash
npm start
```

A API estará disponível em `http://localhost:3000/api`.

### 3. Rodar o front-end

Basta abrir o arquivo `frontend/index.html` no navegador (ou servir a pasta
com uma extensão como *Live Server* do VS Code). O front-end consome a API
em `http://localhost:3000/api/funcionarios`.

> Se o back-end estiver em outro endereço/porta, ajuste a constante
> `API_URL` no início do arquivo `frontend/script.js`.

## Endpoints da API

| Método | Rota                     | Descrição                          |
|--------|---------------------------|-------------------------------------|
| GET    | `/api/funcionarios`       | Lista todos os funcionários         |
| GET    | `/api/funcionarios/:id`   | Busca um funcionário pelo ID        |
| POST   | `/api/funcionarios`       | Cadastra um novo funcionário        |
| PUT    | `/api/funcionarios/:id`   | Atualiza um funcionário existente   |
| DELETE | `/api/funcionarios/:id`   | Remove um funcionário               |

### Exemplo de corpo (POST/PUT)

```json
{
  "nome": "Maria Oliveira",
  "email": "maria@email.com",
  "cargo": "Gerente",
  "telefone": "(11) 99999-0000",
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

## Funcionalidades

- ✅ **Create** — cadastro de funcionário com validação no front e no back
- ✅ **Read** — listagem em tabela, atualizada dinamicamente via API
- ✅ **Update** — edição inline (botão "Editar" carrega os dados no formulário)
- ✅ **Delete** — exclusão com confirmação
- ✅ Preenchimento automático de endereço via CEP (ViaCEP)
- ✅ Validação de e-mail duplicado no back-end
- ✅ Separação em camadas MVC + DAO
