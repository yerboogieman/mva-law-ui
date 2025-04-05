import React, {useContext, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useDispatch} from "react-redux";
import {LanguageContext} from "../../contexts/LanguageContext";
import {setCurrentUser} from "../../redux/currentUserHolder";
import {Link, useNavigate} from 'react-router-dom';
import Toast from "../../components/Toast/Toast";
import * as Yup from "yup";
import api from "../../utilities/api";
import mva_utils from "../../utilities/functions.jsx";

import strings from "./i18n-strings";

export default function SignUp() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || mva_utils.get_device_language());

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toastConfig, setToastConfig] = useState({
        show: false, header_text: "", body_text: "", fade_out: false
    });

    const [pwScore, setPwScore] = useState(0);
    const [pwScoreColor, setPwScoreColor] = useState("#C5C8CB");

    function onSubmit(values) {
        api.do_signup({
            first_name: values.first_name, middle_name: values.middle_name, last_name: values.last_name,
            email: values.email, phone: values.phone, username: values.username, password: values.password
        }).then(result => {

            if (result.success === true) {
                const {token, user} = result;
                dispatch(setCurrentUser(user));
                sessionStorage.setItem("token", token);
                navigate('/test-page'); // TODO: actual dashboard page
            } else {
                setToastConfig({
                    show: true,
                    header_text: strings.toast.header_text,
                    body_text: strings.toast.body_text,
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
        <div className="mt-4 mx-auto col-12 col-lg-4 pb-5">
            <h3 className="mb-3">
                <i className="fad fa-person-circle-plus text-secondary me-3" style={{transform: "translateX(2px)"}}></i>
                {strings.title}
            </h3>
            <div className="mb-3">
                <Formik
                    initialValues={{
                        first_name: "", middle_name: "", last_name: "", email: "", new_password: "", phone_number: ""
                    }}
                    onSubmit={onSubmit}
                    validationSchema={Yup.object({
                        first_name: Yup.string().required(
                            strings.formatString(strings.first_name, strings.yup.is_required)),
                        middle_name: Yup.string().notRequired(),
                        last_name: Yup.string().required(`${strings.last_name} ${strings.yup.is_required}`),
                        phone_number: Yup.number().typeError(strings.yup.integer_type_error)
                            .min(10, strings.formatString(strings.yup.min_integer, 10)),
                        email: Yup.string()
                            .email(strings.yup.email_invalid)
                            .required(`${strings.email} ${strings.yup.is_required}`)
                            .test("uniqueEmail", async function (value, context) {
                                    const check_result = await mva_utils.check_email_for_duplicate(value, context);
                                    return check_result === true || context.createError({message: strings.yup.email_invalid});
                                }),
                        new_password: Yup.string().required(`${strings.password} ${strings.yup.is_required}`)
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
                            })
                    })}
                    validateOnBlur={true}
                    validateOnChange={true}>
                    {() => {
                        return <Form autoComplete="false">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label tc">{strings.first_name}</label>
                                <Field type="text" name="first_name" className="form-control"/>
                                <ErrorMessage name="first_name" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="middle_name" className="form-label tc">{strings.middle_name}</label>
                                <Field type="text" name="middle_name" className="form-control"/>
                                <ErrorMessage name="middle_name" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label tc">{strings.last_name}</label>
                                <Field type="text" name="last_name" className="form-control"/>
                                <ErrorMessage name="last_name" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label tc">{strings.email}</label>
                                <Field id="email" type="text" name="email" className="form-control"/>
                                <ErrorMessage name="email" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone_number" className="form-label tc">{strings.mobile_phone}</label>
                                <Field type="text" name="phone_number" className="form-control"/>
                                <ErrorMessage name="phone_number" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="new_password" className="form-label tc">{strings.password}</label>
                                <Field type="text" name="new_password" className="form-control"
                                       onKeyUp={mva_utils.debounce(function (event) {
                                           if (event.target.value === "") {
                                               setPwScore(-1);
                                               setPwScoreColor("#C5C8CB");
                                           }
                                       }, 200)}/>
                                <ErrorMessage name="new_password" component="div" className="text-danger"/>
                            </div>

                            <div className="mb-3">
                                <div className="form-label mb-2">{strings.password_strength}</div>
                                <div className="row gx-2">
                                    <div className="col-3">
                                        <div className="register-password-strength-level-box"
                                             style={{backgroundColor: pwScoreColor}}>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="register-password-strength-level-box"
                                             style={{backgroundColor: pwScore > 1 && pwScoreColor}}></div>
                                    </div>
                                    <div className="col-3">
                                        <div className="register-password-strength-level-box"
                                             style={{backgroundColor: pwScore > 2 && pwScoreColor}}></div>
                                    </div>
                                    <div className="col-3">
                                        <div className="register-password-strength-level-box"
                                             style={{backgroundColor: pwScore > 3 && pwScoreColor}}></div>
                                    </div>
                                </div>
                                <div className="row gx-2">
                                    <div className="col-3 fs-12 text-center sc">
                                        {`${strings.zxcvbn.very} ${strings.zxcvbn.weak}`}
                                    </div>
                                    <div className="col-3 fs-12 text-center sc">{strings.zxcvbn.weak}</div>
                                    <div className="col-3 fs-12 text-center sc">{strings.zxcvbn.medium}</div>
                                    <div className="col-3 fs-12 text-center sc">{strings.zxcvbn.strong}</div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary sc">{strings.submit}</button>
                        </Form>
                    }}
                </Formik>
            </div>
            <div className="text-center">
                <Link to="/login" className="link-primary link-offset-1-hover">{strings.to_login}</Link>
            </div>
        </div>
    </>;
}