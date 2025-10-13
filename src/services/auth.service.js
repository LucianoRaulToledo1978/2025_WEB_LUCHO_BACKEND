import UserRepository from "../repositories/user.repository.js"

import bcrypt from 'bcrypt'
import transporter from "../config/mailer.config.js"
import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from "jsonwebtoken"

class AuthService{
    static async register(username, password, email){
        console.log(username, password, email)

         const user_found = await UserRepository.getByEmail(email)
         if(user_found){
             throw new ServerError(400, 'Email ya en uso')
         }

         const password_hashed = await bcrypt.hash(password, 12)
         
         const user_created = await UserRepository.createUser(username, email, password_hashed)

         const verification_token = jwt.sign(
            {
                email : email,
                user_id: user_created._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
         )

        await transporter.sendMail({
            from: 'paginasweblucho@gmail.com',
            to: 'paginasweblucho@gmail.com',
            subject: 'Verificacion de correo electronico',
            html: `
            <h1>Hola desde node.js</h1>
            <p>Este es un mail de verificacion</p>
            <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Verificar email</a>`
           
        })


        }

         static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

            await UserRepository.updateById(
                payload.user_id, 
                {
                    verified_email: true
                }
            )

            return 

        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    }

   

    static async login(email, password){
        /* 
        - Buscar por email y guardar en una variable
            - No se encontro: Tiramos error 404 'Email no registrado' / 'El email o la contraseña son invalidos'
        - Usamos bcrypt.compare para checkear que la password recibida sea igual al hash guardado en DB
            - En caso de que no sean iguales: 401 (Unauthorized) 'Contraseña invalida' / 'El email o la contraseña son invalidos'
        - Generar el authorization_token con los datos que coinsideremos importantes para una sesion: (name, email, rol, created_at) (NO PASAR DATOS SENSIBLES)
        - Retornar el token
        */

        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }
        /* Permite saber si cierto valor es igual a otro cierto valor encriptado */
        const is_same_password = await bcrypt.compare(password, user.password)
        if(!is_same_password){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )

        return {
            authorization_token
        }

    }
        
           
        }

export default AuthService