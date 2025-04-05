import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useContext, useEffect, useState} from "react";
import Loading from "react-loading";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import * as Yup from "yup";

import Toast from "../../components/Toast/Toast";
import {LanguageContext} from "../../contexts/LanguageContext";
import {setCurrentUser} from "../../redux/currentUserHolder";
import api from "../../utilities/api";
import mva_utils from "../../utilities/functions.jsx";
import strings from "./i18n-strings";

export default function ResetPassword() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || mva_utils.get_device_language());

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [validToken, setValidToken] = useState("");

    const [pwScore, setPwScore] = useState(0);
    const [pwScoreColor, setPwScoreColor] = useState("#C5C8CB");

    const [toastConfig, setToastConfig] = useState({
        show: false, header_text: "", body_text: "", fade_out: false
    });


    useEffect(() => {

        const token = searchParams.get("token");

        if (token && token.length > 0) {

            api.validate_password_reset_token(token)
                .then(result => {
                    if (result.success === true) {
                        if (result.valid === true) {
                            setLoading(false);
                            setIsTokenValid(true);
                            setValidToken(token);
                        } else {
                            setSearchParams("");
                            setToastConfig({
                                show: true, header_text: strings.toast.invalid_token.header,
                                body_text: strings.toast.invalid_token.body,
                                variant: "warning", fade_out: false
                            });
                        }
                    } else {
                        setSearchParams("");
                        setToastConfig({
                            show: true, header_text: strings.toast.invalid_token.header,
                            body_text: strings.toast.invalid_token.body,
                            variant: "warning", fade_out: false
                        });
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

    }, []);

    function onSubmit(values) {
        setSubmitted(true);

        // submit updated password
        if (isTokenValid && validToken) {

            const {password, repeat_password} = values;

            api.submit_password_reset({password, repeat_password, token: validToken})
                .then(response => {
                    if (response.success === true) {
                        const {token, user} = response;
                        dispatch(setCurrentUser(user));
                        sessionStorage.setItem("token", token);
                        navigate("/users"); // TODO: actual dashboard page
                    } else {
                        setToastConfig({
                            show: true, header_text: strings.toast.error.header, body_text: strings.toast.error.body,
                            variant: "warning", fade_out: false
                        });
                    }
                })

        } else {
            // request password reset email
            api.request_password_reset(values.email)
                .then(result => {
                    setSubmitted(false);
                    if (result.success === true) {
                        setToastConfig({
                            show: true, header_text: strings.toast.success.header, body_text: result.data,
                            variant: "success", fade_out: false
                        });
                    } else {
                        setToastConfig({
                            show: true, header_text: strings.toast.error.header, body_text: strings.toast.error.body,
                            variant: "warning", fade_out: false
                        });
                    }
                });
        }
    }

    return <>
        <Toast show={toastConfig.show}
               header_text={toastConfig.header_text}
               body_text={toastConfig.body_text}
               fadeOut={toastConfig.fade_out}
               variant={toastConfig.variant}
               onClose={function () {
                   return setToastConfig({...toastConfig, show: false});
               }}>
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
                    Case Flow Pro
                </div>
            </div>
        </nav>
        <div className="mx-auto col-5">
            {
                loading
                    ? <Loading type="cylon" color="orange"/>
                    : isTokenValid
                        ? <>
                            <h3 className="tc">{strings.title}</h3>
                            <div className="mb-3">
                                <Formik initialValues={{
                                    password: "", repeat_password: ""
                                }}
                                        onSubmit={onSubmit}
                                        validationSchema={Yup.object({
                                            password: Yup.string().required(
                                                `${strings.password} ${strings.yup.is_required}`)
                                                .min(5, strings.password_length)
                                                .test("strongPassword", function (value, context) {

                                                    const password_strength = mva_utils.check_password_strength(value);
                                                    const {color, score} = password_strength;

                                                    setPwScore(score);
                                                    setPwScoreColor(color);

                                                    const feedback = password_strength.feedback.length > 0
                                                        ? strings.zxcvbn[password_strength.feedback]
                                                        : strings.zxcvbn["This password is not very strong."];

                                                    if (password_strength.score > 2) {
                                                        return true;
                                                    } else {
                                                        return context.createError({message: feedback});
                                                    }
                                                }),
                                            repeat_password: Yup.string()
                                                .required(`${strings.repeat_password} ${strings.yup.is_required}`)
                                                .oneOf([Yup.ref("password")], "Passwords and Repeat Password must match.")
                                        })}>{() => {
                                    return <Form>
                                        <input type="hidden" value={validToken}/>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label tc">{strings.password}</label>
                                            <Field type="password" name="password" className="form-control"/>
                                            <ErrorMessage name="password" component="div" className="text-danger tc"/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="repeat_password"
                                                   className="form-label tc">{strings.repeat_password}</label>
                                            <Field type="password" name="repeat_password" className="form-control"/>
                                            <ErrorMessage name="repeat_password" component="div"
                                                          className="text-danger tc"/>
                                        </div>
                                        {
                                            !submitted ?
                                                <button type="submit"
                                                        className="btn btn-primary tc px-3">{strings.submit}</button>
                                                : <button type="submit" disabled
                                                          className="btn btn-primary tc px-3">
                                                    <i className="fa-duotone fa-spinner-scale fa-spin-pulse me-2"
                                                       style={{
                                                           "--fa-primary-color": "white", "--fa-secondary-color": "white"
                                                       }}></i>
                                                    {strings.submit}
                                                </button>
                                        }
                                    </Form>;
                                }}
                                </Formik>
                            </div>
                            <div className="text-center">
                                <Link to="/login" className="link-primary link-offset-1-hover tc">{strings.to_login}</Link>
                            </div>
                        </>
                        : <>
                            {/* Request Password Form */}
                            <h3 className="tc">{strings.title}</h3>
                            <div className="mb-3">
                                <Formik initialValues={{
                                    email: ""
                                }}
                                        onSubmit={onSubmit}
                                        validationSchema={Yup.object({
                                            email: Yup.string()
                                                .email(strings.yup.email_invalid)
                                                .required(`Email ${strings.yup.is_required}`)
                                        })}>{() => {
                                    return <Form>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label tc">{strings.email}</label>
                                            <Field type="text" name="email" className="form-control"/>
                                            <ErrorMessage name="email" component="div" className="text-danger sc"/>
                                        </div>
                                        {
                                            !submitted ?
                                                <button type="submit"
                                                        className="btn btn-primary tc px-3">{strings.submit}</button>
                                                : <button type="submit" disabled
                                                          className="btn btn-primary tc px-3">
                                                    <i className="fa-duotone fa-spinner-scale fa-spin-pulse me-2"
                                                       style={{
                                                           "--fa-primary-color": "white", "--fa-secondary-color": "white"
                                                       }}></i>
                                                    {strings.submit}
                                                </button>
                                        }
                                    </Form>;
                                }}
                                </Formik>
                            </div>
                            <div className="text-center">
                                <Link to="/login" className="link-primary link-offset-1-hover tc">{strings.to_login}</Link>
                            </div>
                        </>
            }


        </div>
    </>;
}

