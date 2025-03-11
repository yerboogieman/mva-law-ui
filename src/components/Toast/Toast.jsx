import React, {useEffect} from "react";
import {CloseButton, Toast as BS_Toast, ToastContainer} from "react-bootstrap";

export default function Toast({show, onClose, header_text, body_text, fadeOut = false, variant = "success"}) {

    let timeout = 0;

    useEffect(function () {
        if (fadeOut && show) {
            timeout = setTimeout(function () {
                onClose();
            }, 5000);
        } else {
            clearTimeout(timeout);
        }
    }, [show]);

    return <ToastContainer
        className="position-fixed start-50 translate-middle-x px-2 px-sm-0"
        style={{zIndex: 100, top: "15px"}}>
        <BS_Toast show={show} style={{width: "488px"}}
                  className={`border border-1 border-${variant} bg-${variant}-subtle`}>
            <div className="d-flex py-2 ps-3 pe-4">
                <div className="me-2">
                    <div className={`rounded-circle bg-${variant}-subtle p-1`} style={{height: "32px", width: "32px"}}>
                        {variant === "success" ? <i className="fa-duotone fa-octagon-check"></i> : <i
                            className="fa-duotone fa-octagon-exclamation"></i>}
                    </div>
                </div>
                <div className="me-3">
                    <div className="fw-500 fs-16 text-black mb-1">
                        {header_text}
                    </div>
                    <div className="fs-16 text-black">
                        {body_text}
                    </div>
                </div>
                <div className="ms-auto">
                    <CloseButton onClick={handle_close}/>
                </div>
            </div>

        </BS_Toast>
    </ToastContainer>

    function handle_close() {
        clearTimeout(timeout);
        onClose();
    }
}