import LocalizedStrings from "react-localization";
import mva_utils from "../../../utilities/functions.jsx";

import global_strings from "../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Client Reviews Estimate",
        submit: "Approve Estimate",
        case: "Case",
        name: "Name",
        item: "Item",
        step: "Step",
        description: "Description",
        disapprove_label: "Disapproval reason",
        disapproval_description: "Please thoroughly describe the reason you are rejecting so we can correctly address your concerns.",
        estimate: "Estimate",
        toast: {
            error: {
                header: "Account set up unsuccessful",
                body: "There was an error setting up your account. Please review your information and try again."
            }
        }
    },
    "es": {
        title: "Cliente Revisa Estimación",
        submit: "Aprobar Estimación",
        case: "Caso",
        name: "Nombre",
        item: "Elemento",
        step: "Paso",
        description: "Descripción",
        disapprove_label: "Motivo de desaprobación",
        disapproval_description: "Por favor describa detalladamente el motivo por el que rechaza para que podamos abordar correctamente sus inquietudes.",
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