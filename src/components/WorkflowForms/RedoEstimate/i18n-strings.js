import LocalizedStrings from "react-localization";
import jb_utils from "../../../utilities/functions.jsx";

import global_strings from "../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Redo Estimate",
        submit: "Update Job",
        job: "Job",
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
        title: "",
        submit: "",
        name: "",
        description: "",
        toast: {
            error: {
                header: "",
                body: ""
            }
        }
    }
};

const merged = jb_utils.deep_merge(global_strings, local);

const strings = new LocalizedStrings(merged);

export default strings;