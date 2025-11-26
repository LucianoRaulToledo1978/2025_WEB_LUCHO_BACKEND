import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";

import ENVIRONMENT from "./src/environment.config.js";
import connectMongoDB from "./src/mongoDB.config.js";

// RUTAS (según tus archivos REALES)
import auth_router from "./src/auth.router.js";
import workspace_router from "./src/workspace.route.js";
import member_router from "./src/member.router.js";
import chat_router from "./src/chat.router.js";

connectMongoDB();

const app = express();

// --- CORS CONFIG CORRECTA ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://2025-web-lucho-front.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Para que OPTIONS / preflight funcione
app.options("*", cors());

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

// --- TEST ROUTE ---
app.get('/api/status', (req, res) => {
  res.send({ ok: true, message: 'esto esta funcionando' });
});

// --- ROUTES ---
app.use('/api/auth', auth_router);
app.use('/api/workspace', workspace_router);
app.use('/api/member', member_router);
app.use('/api/chat', chat_router);

// --- ONE LISTEN ONLY ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server on port " + PORT));
