import LocalizedStrings from "react-localization";
import mva_utils from "../../../utilities/functions.jsx";

import global_strings from "../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Create Estimate",
        submit: "Save Case",
        case: "Case",
        name: "Name",
        item: "Item",
        step: "Step",
        description: "Description",
        estimate: "Estimate",
        toast: {
            error: {
                header: "Account set up unsuccessful",
                body: "There was an error setting up your account. Please review your information and try again."
            }
        }
    },
    "es": {
        title: "Crear Estimación",
        submit: "Guardar Caso",
        case: "Caso",
        name: "Nombre",
        item: "Elemento",
        step: "Paso",
        description: "Descripción",
        estimate: "Estimación",
        toast: {
            error: {
                header: "Configuración de cuenta fallida",
                body: "Hubo un error al configurar su cuenta. Por favor revise su información e intente de nuevo."
            }
        }
    }
};

const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;