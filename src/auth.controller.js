import AuthService from "./auth.service.js";
import { ServerError } from "./customError.utils.js";
import ENVIRONMENT from "./environment.config.js";

class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username) throw new ServerError(400, "Debes enviar un nombre de usuario valido");
            if (!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                throw new ServerError(400, "Debes enviar un email valido");
            if (!password || password.length < 8)
                throw new ServerError(400, "Debes enviar una contraseña valida");

            await AuthService.register(username, password, email);

            return res.json({
                ok: true,
                status: 200,
                message: "Usuario registrado correctamente"
            });
        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { authorization_token } = await AuthService.login(email, password);

            return res.json({
                ok: true,
                message: "Logueado con exito",
                status: 200,
                data: { authorization_token }
            });
        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { verification_token } = req.params;
            await AuthService.verifyEmail(verification_token);

            return res.redirect(ENVIRONMENT.URL_FRONTEND + "/login");
        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }
}

export default AuthController;
