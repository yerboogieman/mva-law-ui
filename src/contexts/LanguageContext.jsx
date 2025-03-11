import {createContext, useReducer} from "react";
import languageReducer from "../reducers/languageReducer";
import jb_utils from "../utilities/functions.jsx";

export const LanguageContext = createContext(null);
export const LanguageContextDispatch = createContext(null);

export default function LanguageProvider({children}) {
    const initial = jb_utils.get_device_language();
    const [language, dispatch] = useReducer(languageReducer, initial);
    return (
        <LanguageContext.Provider value={language}>
            <LanguageContextDispatch.Provider value={dispatch}>
                {children}
            </LanguageContextDispatch.Provider>
        </LanguageContext.Provider>
    )
}
