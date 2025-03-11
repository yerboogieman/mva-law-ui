import LocalizedStrings from "react-localization";
import jb_utils from "../../../utilities/functions.jsx";

import global_strings from "../../../utilities/i18n-strings-global";

const local = {
    "en":{
        title: "Client Reviews Estimate",
        submit: "Approve Estimate",
        job: "Job",
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