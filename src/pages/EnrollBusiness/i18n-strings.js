import LocalizedStrings from "react-localization";
import jb_utils from "../../utilities/functions.jsx";

import global_strings from "../../utilities/i18n-strings-global";

const local = {
    "en":{
        and: "and",
        i_agree_to: "I agree to the",
        terms_of_service: "Terms of Service",
        privacy_policy: "Privacy Policy",
        title: "Sign up your business",
        submit: "Finish sign up",
        to_login: "Already have an account? Sign in here.",
        password_strength: "Password strength",
        password_length: "Password must be 5 characters long",
        business_name: "Business name",
        toast: {
            error: {
                header: "Account set up unsuccessful",
                body: "There was an error setting up your account. Please review your information and try again."
            }
        }
    },
    "es": {
        and: "y",
        i_agree_to: "estoy de acuerdo con los",
        terms_of_service: "Términos de Servicio",
        privacy_policy: "Política de Privacidad",
        title: "Regístrate tu negocio",
        submit: "Inscribirse",
        to_login: "¿Ya tienes una cuenta? Firme aquí.",
        password_strength: "Seguridad de la contraseña",
        password_length: "La contraseña debe tener 5 caracteres",
        business_name: "Nombre del Negocio",
        toast: {
            error: {
                header: "La cuenta no se ha configurado correctamente",
                body: "Se produjo un error al configurar su cuenta. Revise su información e inténtelo nuevamente."
            }
        }
    }
};

const merged = jb_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;