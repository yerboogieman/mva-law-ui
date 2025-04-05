import LocalizedStrings from "react-localization";
import mva_utils from "../../../utilities/functions.jsx";

import global_strings from "../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Redo Estimate",
        submit: "Update Case",
        case: "Case",
        name: "Name",
        item: "Item",
        step: "Step",
        description: "Description",
        estimate: "Estimate",
        toast: {
            error: {
                header: "",
                body: ""
            }
        }
    },
    "es": {
        title: "Rehacer Estimación",
        submit: "Actualizar Caso",
        case: "Caso",
        name: "Nombre",
        item: "Elemento",
        step: "Paso",
        description: "Descripción",
        estimate: "Estimación",
        toast: {
            error: {
                header: "Error al Actualizar",
                body: "Hubo un error al actualizar la estimación. Por favor, intente de nuevo."
            }
        }
    }
};

const merged = mva_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;