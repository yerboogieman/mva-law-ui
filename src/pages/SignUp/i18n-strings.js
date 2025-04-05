import LocalizedStrings from "react-localization";
import mva_utils from "../../utilities/functions.jsx";

import global_strings from "../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Sign up for an account",
        submit: "Sign up",
        to_login: "Already have an account.",
        password_strength: "Password strength",
        password_length: "Password must be 5 characters long",
        toast: {
            error: {
                header: "Account set up unsuccessful",
                body: "There was an error setting up your account. Please review your information and try again."
            }
        }
    },
    "es": {
        title: "Regístrese para obtener una cuenta",
        submit: "caccesso",
        create_account: "¿Nuevo aquí? Crea una cuenta.",
        to_login: "Ya tienes una cuenta.",
        password_strength: "Seguridad de la contraseña",
        password_length: "La contraseña debe tener 5 caracteres",
        toast: {
            error: {
                header: "La cuenta no se ha configurado correctamente",
                body: "Se produjo un error al configurar su cuenta. Revise su información e inténtelo nuevamente."
            }
        }
    }
};

const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;