
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import workspace_router from "./routes/workspace.route.js";
import handlebars from 'express-handlebars'
import auth_router from "./routes/auth.router.js";
import jwt from 'jsonwebtoken'


import express from 'express'
import WorkspacesRepository from "./repositories/workspace.repository.js";
import UserRepository from "./repositories/user.repository.js";

import cors from 'cors'

import authMiddleware from "./middleware/auth.middleware.js";


import MemberWorkspaceRepository from "./repositories/memberWorkspace.repository.js";
import member_router from "./routes/member.router.js";

import chat_router from "./routes/chat.router.js";



connectMongoDB()

const app = express()
app.use(cors({
  origin: "*",
  credentials: true
}));




//Configurar a mi app de express para que use handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine({
    runtimeOptions: { 
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))

/* Delegamos a handlebars como motor de vistas (plantillas) */
app.set('view engine', 'handlebars');

/* Marcamos la carpeta donde estaran las plantillas */
app.set('views', './src/views');

app.use(express.json())


app.get('/test', async (request, response) =>{
    let edad = 50
    const workspaces = await WorkspacesRepository.getAll()
    //Respondo con la plantilla home.handlebars 
    response.render(
        'home', 
        {
            name: 'pepe',
            is_admin: false,
            es_mayor: edad >= 18,
            workspaces: workspaces
        }
    )
})

app.get('/workspace/:workspace_id', async (request, response) => {
    const {workspace_id} = request.params
    const workspace_detail = await WorkspacesRepository.getById(workspace_id)
    response.render('workspace-detail', {
        workspace: workspace_detail
    })
})


app.get('/api/status',(request, response)=>{    
    response.send({
        ok: true,
        message:'esto esta funcionando'
    })
})

/*
app.get('/api/ping',(request,esponse)=>{
    response.send({
        ok: true,
        message:'pong'
    })
})*/

app.use('/api/workspace', workspace_router)
app.use('/api/auth', auth_router)
app.use('/api/member', member_router)
app.use("/api/chat", chat_router);



//Constructor de middlewares
const randomMiddleware = (min_numero_random) => {
    return (request, response, next) =>{
        const numero_random = Math.random()
        if(numero_random < min_numero_random){
            response.send({message: 'Tienes mala suerte'})
        }
        else{
            request.tieneSuerte = true
            next()
        }
    }
}

/* 
 */
//Personalizar el randomMiddleware para que podamos configurar el numero minimo de suerte (0.5 por defecto)

// app.get('/test-render',  randomMiddleware(0.9), (request, response) => {
//     console.log(request.tieneSuerte)
//     response.send({
//         ok: true
//     })
// })

app.get('/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)
    response.send({
        ok: true
    })
})







const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server on port " + PORT));




 /*MemberWorkspaceRepository.create(

/*'68ea9e70eac7ab3dcb36565f'.
'68e946b45f6b056eb72b219b' ,
'68cde97552d83568e2ecb090'
    
)*/


//MemberWorkspaceRepository.getAllWorkspacesByUserId('68ea9e70eac7ab3dcb36565f')   
