import {createContext, useReducer} from "react";
import toastReducer from "../reducers/toastReducer";
import Toast from "../components/Toast/Toast";

export const MessageContext = createContext(null);
export const MessageContextDispatch = createContext(null);

export default function MessageProvider({children}) {

    const initial = {
        show: false,
        header_text: "",
        body_text: "",
        fade_out: false,
        onClose: function (fn) {
            return fn();
        }
    };

    const [toastConfig, dispatch] = useReducer(toastReducer, initial);

    return (
        <MessageContext.Provider value={toastConfig}>
            <MessageContextDispatch.Provider value={dispatch}>
                <Toast show={toastConfig.show}
                       header_text={toastConfig.header_text}
                       body_text={toastConfig.body_text}
                       fadeOut={toastConfig.fade_out}
                       variant={toastConfig.variant}
                       onClose={function () {
                           dispatch({type: "dismiss_toast"});
                       }}/>
                {children}
            </MessageContextDispatch.Provider>
        </MessageContext.Provider>
    )

}
