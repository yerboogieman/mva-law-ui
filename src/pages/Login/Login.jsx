import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";

import Toast from "../../components/Toast/Toast";
import {LanguageContext} from "../../contexts/LanguageContext";
import {setCurrentUser} from "../../redux/currentUserHolder";

import api from "../../utilities/api";
import mva_utils from "../../utilities/functions.jsx";

import strings from "./i18n-strings";

export default function Login() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || mva_utils.get_device_language());

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toastConfig, setToastConfig] = useState({
        show: false, header_text: "", body_text: "", fade_out: false
    });

    useEffect(() => {
        mva_utils.logout();
    }, []);

    function onSubmit(values) {
        api.do_login({
            email: values.email, password: values.password
        }).then(result => {
            if (result.success === true) {
                const {user} = result;
                dispatch(setCurrentUser(user));
                sessionStorage.setItem("token", result.token);
                navigate("/case-list");
            } else {
                setToastConfig({
                    show: true, header_text: strings.toast.error.header, body_text: strings.toast.error.body,
                    variant: "warning", fade_out: false
                });
            }
        });
    }

    return <>
        <Toast show={toastConfig.show}
               header_text={toastConfig.header_text}
               body_text={toastConfig.body_text}
               fadeOut={toastConfig.fade_out}
               variant={toastConfig.variant}
               onClose={() => setToastConfig({...toastConfig, show: false})}>
        </Toast>

        <nav className="navbar navbar-expand-lg navbar-light mb-5">
            <div className="container-fluid justify-content-between">
                <div className="rounded-circle bg-primary p-2 text-white text-center" style={{
                    height: 40,
                    width: 40
                }}>
                    <div style={{marginTop: 2}}>
                        <i className="fa-solid fa-j" style={{transform: "translateX(2px)"}}></i>
                        <i className="fa-solid fa-f" style={{transform: "translateY(-3px)"}}></i>
                    </div>
                    MVA Law // TODO: Internationalize
                </div>
            </div>
        </nav>
        <div className="mx-auto col-5">
            <h3 className="tc">{strings.title}</h3>
            <div className="mb-3">
                <Formik initialValues={{
                    password: "", email: ""
                }}
                        onSubmit={onSubmit}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email(strings.yup.email_invalid)
                                .required(`${strings.yup.email} ${strings.yup.is_required}`),
                            password: Yup
                                .string()
                                .required(`${strings.yup.password} ${strings.yup.is_required}`)
                        })}>{() => {
                    return <Form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label tc">{strings.email}</label>
                            <Field type="text" name="email" className="form-control"/>
                            <ErrorMessage name="email" component="div" className="text-danger tc"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label tc">{strings.password}</label>
                            <Field type="password" name="password" className="form-control"/>
                            <ErrorMessage name="password" component="div" className="text-danger tc"/>
                        </div>
                        <button type="submit" className="btn btn-primary tc">{strings.submit}</button>
                    </Form>;
                }}
                </Formik>
            </div>
            <div className="text-center">
                <Link to="/enroll-business" className="link-primary link-offset-1-hover tc">{strings.create_account}</Link>
            </div>
            <div className="text-center mt-2">
                <Link to="/reset-password" className="link-primary link-offset-1-hover tc">{strings.forgot_password}</Link>
            </div>
        </div>
    </>;
}

