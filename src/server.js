import ENVIRONMENT from "./environment.config.js";
import connectMongoDB from "./mongoDB.config.js";

import workspace_router from "./workspace.route.js";
import auth_router from "./auth.router.js";
import member_router from "./member.router.js";
import chat_router from "./chat.router.js";

import WorkspacesRepository from "./workspace.repository.js";
import UserRepository from "./user.repository.js";
import MemberWorkspaceRepository from "./memberWorkspace.repository.js";

import authMiddleware from "./auth.middleware.js";


connectMongoDB();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: false
}));

app.engine('handlebars', handlebars.engine({
  runtimeOptions: { 
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));

app.set('view engine', 'handlebars');

// ❗ VIEWS CORREGIDO — estaban en una carpeta que no existe
app.set('views', './');  

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.send({
    ok: true,
    message: 'esto esta funcionando'
  });
});

app.use('/api/workspace', workspace_router);
app.use('/api/auth', auth_router);
app.use('/api/member', member_router);
app.use('/api/chat', chat_router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server on port " + PORT));
