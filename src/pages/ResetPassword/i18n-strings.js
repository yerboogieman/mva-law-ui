import LocalizedStrings from "react-localization";
import mva_utils from "../../utilities/functions.jsx";

import global_strings from "../../utilities/i18n-strings-global";

const local = {
    "en":{
        password: "password",
        repeat_password: "repeat password",
        password_strength: "Password strength",
        password_length: "Password must be 5 characters long",
        passwords_mismatch: "Both entries must match.",
        title: "Reset Passwords",
        username: "username",
        submit: "Submit",
        to_login: "Back to login",

        toast: {
            error: {
                header: "Reset unsuccessful",
                body: "Please check your email and try again."
            },
            invalid_token: {
              header: "Invalid or expired token",
              body: "This token has expired or is invalid. Please request another."
            },
            success: {
                header: "Reset password request",
                body: "A Password reset email successfully sent if associated with an account."
            }
        }
    },
    "es": {
        password: "contraseña",
        repeat_password: "Repita la contraseña",
        password_strength: "Seguridad de la contraseña",
        password_length: "La contraseña debe tener 5 caracteres.",
        passwords_mismatch: "Ambas entradas deben coincidir.",
        title: "accesso",
        username: "nombre de usuario",
        submit: "acceso",
        to_login: "Volver al inicio de sesión",
        toast: {
            error: {
                header: "Iniciar sesión sin éxito",
                body: "Por favor verifique su nombre de usuario y contraseña e inténtelo nuevamente."
            },
            invalid_token: {
                header: "Token no válido o caducado",
                body: "Este token ha caducado o no es válido. Por favor solicite otro."
            },
            success: {
                header: "Solicitud de restablecimiento de contraseña",
                body: "Un correo electrónico para restablecer la contraseña se envió correctamente si está asociado con una cuenta."
            }
        }
    }
};

const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;