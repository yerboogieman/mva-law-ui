export default function toastReducer(toastConfig, action) {

    const default_toast = {
        show: false,
        header_text: "",
        body_text: "",
        fadeOut: false,
        variant: "success"
    };

    switch (action.type) {
        case 'show_toast': {

            const {
                header_text = default_toast.header_text,
                body_text = default_toast.body_text,
                fadeOut = default_toast.fadeOut,
                variant = default_toast.variant

            } = action;

            return {
                header_text,
                body_text,
                fadeOut,
                variant,
                show: true
            };
        }
        case 'dismiss_toast': {
            return default_toast;
        }
        default: {
            throw Error('Unknown toast action: ' + action.type);
        }
    }
}
