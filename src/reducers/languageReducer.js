export default function languageReducer(languageConfig, action) {

    const default_language = "en";

    switch (action.type) {
        case "set_language": {
            const {language = default_language} = action;
            return language;
        }

        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}
