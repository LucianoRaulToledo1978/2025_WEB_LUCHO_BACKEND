import ENVIRONMENT from "./environment.config.js";
import connectMongoDB from "./mongoDB.config.js";

import workspace_router from "./workspace.route.js";
import auth_router from "./auth.router.js";
import member_router from "./member.router.js";
import chat_router from "./chat.router.js";

import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";

connectMongoDB();

const app = express();

// --- CORS CORRECTO ---
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://tu-frontend.vercel.app",
        "https://two025-web-lucho-frontend.vercel.app"  // agregá frontend real acá
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// --- HANDLEBARS ---
app.engine('handlebars', handlebars.engine({
  runtimeOptions: { 
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));

app.set('view engine', 'handlebars');
app.set('views', './');

// --- ENDPOINT DE PRUEBA ---
app.get('/api/status', (req, res) => {
  res.send({ ok: true, message: 'esto esta funcionando' });
});

// --- RUTAS ---
app.use('/api/auth', auth_router);
app.use('/api/workspace', workspace_router);
app.use('/api/member', member_router);
app.use('/api/chat', chat_router);

// --- UN SOLO app.listen ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server on port " + PORT));
