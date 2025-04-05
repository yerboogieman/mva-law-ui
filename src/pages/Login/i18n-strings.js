import LocalizedStrings from "react-localization";
import mva_utils from "../../utilities/functions.jsx";

import global_strings from "../../utilities/i18n-strings-global";

const local = {
    "en":{
        login_title: "taco",
        title: "login",
        submit: "login",
        create_account: "New here? Create an account.",
        forgot_password: "Forgot password?",
        toast: {
            error: {
                header: "Login unsuccessful",
                body: "Please check your username and password and try again."
            }
        },
        username: "username",
    },
    "es": {
        username: "nombre de usuario",
        submit: "acceso",
        create_account: "¿Nuevo aquí? Crea una cuenta.",
        forgot_password: "¿Has olvidado tu contraseña?",
        title: "accesso",
        toast: {
            error: {
                header: "Iniciar sesión sin éxito",
                body: "Por favor verifique su nombre de usuario y contraseña e inténtelo nuevamente."
            }
        }
    }
};


const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;