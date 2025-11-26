import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import transporter from "./mailer.config.js";
import ENVIRONMENT from "./environment.config.js";
import { ServerError } from "./customError.utils.js";
import jwt from "jsonwebtoken";

class AuthService {
    static async register(username, password, email) {
        const user_found = await UserRepository.getByEmail(email);
        if (user_found) throw new ServerError(400, "Email ya en uso");

        const password_hashed = await bcrypt.hash(password, 12);

        const user_created = await UserRepository.createUser(
            username,
            email,
            password_hashed
        );

        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created._id.toString()
            },
            ENVIRONMENT.JWT_SECRET_KEY
        );

        await transporter.sendMail({
            from: ENVIRONMENT.GMAIL_USERNAME,
            to: email,
            subject: "Verificacion de correo electronico",
            html: `
                <h1>Hola desde node.js</h1>
                <p>Este es un mail de verificacion</p>
                <a href="${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}">Verificar email</a>
            `
        });
    }

    static async verifyEmail(verification_token) {
        const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY);

        await UserRepository.updateById(payload.user_id, {
            verified_email: true
        });

        return;
    }

    static async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) throw new ServerError(404, "Email no registrado");
        if (user.verified_email === false)
            throw new ServerError(401, "Email no verificado");

        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) throw new ServerError(401, "Contraseña incorrecta");

        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.username,
                email: user.email,
                created_at: user.created_at,
                role: "user"
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return { authorization_token };
    }
}

export default AuthService;
