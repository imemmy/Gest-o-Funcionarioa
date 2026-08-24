// =====================================================
// SERVIDOR
// Ponto de entrada da aplicação: configura o Express,
// middlewares globais e registra as rotas da API.
// =====================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const funcionarioRoutes = require("./src/routes/funcionarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Todas as rotas da API ficam sob o prefixo /api
app.use("/api", funcionarioRoutes);

// Rota de verificação de saúde da API
app.get("/api/status", (req, res) => {
    res.json({ status: "online" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
