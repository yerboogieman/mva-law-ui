import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useContext, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import Brand from "../../components/Brand/Brand";
import Toast from "../../components/Toast/Toast";
import {LanguageContext} from "../../contexts/LanguageContext";
import {setCurrentUser} from "../../redux/currentUserHolder";
import api from "../../utilities/api";
import jb_utils from "../../utilities/functions.jsx";

import strings from "./i18n-strings";

export default function EnrollBusiness() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || jb_utils.get_device_language());

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toastConfig, setToastConfig] = useState({
        show: false,
        header_text: "",
        body_text: "",
        fade_out: false
    });

    const [pwScore, setPwScore] = useState(0);
    const [pwScoreColor, setPwScoreColor] = useState("#C5C8CB");

    function submit_business(values) {
        api.enroll_business({
            business_name: values.business_name,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone_number,
            username: values.username,
            password: values.new_password
        }).then(result => {

            if (result.success === true) {
                const {
                    token,
                    user
                } = result;

                dispatch(setCurrentUser(user));
                sessionStorage.setItem("token", token);

                navigate("/job-list");
            } else {
                setToastConfig({
                    show: true,
                    header_text: strings.toast.header_text,
                    body_text: strings.toast.body_text,
                    variant: "warning",
                    fade_out: false
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
               onClose={() => setToastConfig({
                   ...toastConfig,
                   show: false
               })}>
        </Toast>

        <div className="container px-5">
            <div className="mb-3">
                <Formik
                    initialValues={{
                        business_name: "",
                        first_name: "",
                        last_name: "",
                        email: "",
                        new_password: "",
                        phone_number: ""
                    }}
                    onSubmit={submit_business}
                    validationSchema={Yup.object({
                        business_name: Yup.string().required(
                            strings.formatString(`${strings.business_name} ${strings.yup.is_required}`)),
                        first_name: Yup.string().required(
                            strings.formatString(`${strings.first_name} ${strings.yup.is_required}`)),
                        last_name: Yup.string().required(`${strings.last_name} ${strings.yup.is_required}`),
                        phone_number: Yup.number().typeError(strings.yup.integer_type_error)
                            .min(10, strings.formatString(strings.yup.min_integer, 10)),
                        email: Yup.string()
                            .email(strings.yup.email_invalid)
                            .required(`An ${strings.email} ${strings.yup.is_required}`)
                            .test("uniqueEmail", async function (value, context) {

                                const check_result = await api.check_for_duplicate({value});
                                if (typeof check_result === "object") {
                                    return check_result.valid === true || context.createError(
                                        {message: strings.yup.email_invalid});
                                }
                            }),
                        new_password: Yup.string().required(`A ${strings.password} ${strings.yup.is_required}`)
                            .min(5, strings.password_length)
                            .test("strongPassword", function (value, context) {

                                const password_strength = jb_utils.check_password_strength(value);
                                const {
                                    color,
                                    score
                                } = password_strength;

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
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="border border-2 rounded text-bg-light p-4">
                                        <fieldset>
                                            <legend><i className="fa-duotone fa-user me-3"></i>Account admin</legend>
                                            <div className="row g-3">
                                                <div className="col-12 mb-md-2">
                                                    <label htmlFor="first_name"
                                                           className="form-label tc">
                                                        <sup className="text-danger me-2">*</sup>
                                                        {strings.business_name}
                                                    </label>
                                                    <Field type="text" name="business_name" className="form-control"/>
                                                    <ErrorMessage name="business_name" component="div"
                                                                  className="d-block invalid-feedback"/>
                                                </div>
                                            </div>

                                            <div className="row g-3">
                                                <div className="col-12 col-md-6 mb-md-2">
                                                    <label htmlFor="first_name"
                                                           className="form-label tc">
                                                        <sup className="text-danger me-2">*</sup>
                                                        {strings.first_name}
                                                    </label>
                                                    <Field type="text" name="first_name" className="form-control"/>
                                                    <ErrorMessage name="first_name" component="div"
                                                                  className="d-block invalid-feedback"/>
                                                </div>
                                                <div className="col-12 col-md-6 mb-md-2">
                                                    <label htmlFor="last_name"
                                                           className="form-label tc">
                                                        <sup className="text-danger me-2">*</sup>
                                                        {strings.last_name}
                                                    </label>
                                                    <Field type="text" name="last_name" className="form-control"/>
                                                    <ErrorMessage name="last_name" component="div"
                                                                  className="d-block invalid-feedback"/>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email"
                                                       className="form-label tc">
                                                    <sup className="text-danger me-2">*</sup>
                                                    {strings.email}
                                                </label>
                                                <Field id="email" type="text" name="email"
                                                       className="form-control"/>
                                                <ErrorMessage name="email" component="div"
                                                              className="d-block invalid-feedback"/>
                                            </div>


                                            <div className="mb-3">
                                                <label htmlFor="phone_number"
                                                       className="form-label tc">
                                                    {strings.mobile_phone}
                                                    <span className="text-body-secondary ms-1 ">
                                                            <span>(to receive <span>SMS</span> notifications)</span>
                                                            </span>
                                                </label>
                                                <Field type="text" name="phone_number" className="form-control"/>
                                                <ErrorMessage name="phone_number" component="div"
                                                              className="d-block invalid-feedback"/>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="new_password"
                                                       className="form-label tc">
                                                    <sup className="text-danger me-2">*</sup>
                                                    {strings.password}
                                                </label>
                                                <Field type="password" name="new_password" className="form-control"
                                                       onKeyUp={jb_utils.debounce(function (event) {
                                                           if (event.target.value === "") {
                                                               setPwScore(-1);
                                                               setPwScoreColor("#C5C8CB");
                                                           }
                                                       }, 200)}/>
                                                <ErrorMessage name="new_password" component="div"
                                                              className="d-block invalid-feedback"/>
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
                                                             style={{
                                                                 backgroundColor: pwScore > 1 && pwScoreColor
                                                             }}></div>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="register-password-strength-level-box"
                                                             style={{
                                                                 backgroundColor: pwScore > 2 && pwScoreColor
                                                             }}></div>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="register-password-strength-level-box"
                                                             style={{
                                                                 backgroundColor: pwScore > 3 && pwScoreColor
                                                             }}></div>
                                                    </div>
                                                </div>
                                                <div className="row gx-2">
                                                    <div className="col-3 fs-12 text-center sc">
                                                        {`${strings.zxcvbn.very} ${strings.zxcvbn.weak}`}
                                                    </div>
                                                    <div
                                                        className="col-3 fs-12 text-center sc">{strings.zxcvbn.weak}</div>
                                                    <div
                                                        className="col-3 fs-12 text-center sc">{strings.zxcvbn.medium}</div>
                                                    <div
                                                        className="col-3 fs-12 text-center sc">{strings.zxcvbn.strong}</div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <sup className="text-danger me-2">*</sup>
                                                <Field type="checkbox" name="terms_and_conditions"
                                                       className="form-check-input" id="terms_and_conditions"/>
                                                <label htmlFor="terms_and_conditions"
                                                       className="form-check-label ms-2">
                                                    {strings.i_agree_to}
                                                    <a className="link-dark mx-1">{strings.terms_of_service}</a>{strings.and}
                                                    <a className="link-dark ms-1">{strings.privacy_policy}</a>.
                                                </label>
                                                <ErrorMessage name="terms_and_conditions" component="div"
                                                              className="d-block invalid-feedback"/>
                                            </div>

                                        </fieldset>
                                        <div className="text-center my-3">
                                            <button type="submit"
                                                    className="btn btn-warning w-100 sc">{strings.submit}</button>
                                        </div>
                                        <div className="text-center">
                                            <Link to="/login"
                                                  className="link-primary link-offset-1-hover">{strings.to_login}</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-grow-1 col-12 col-md-6 text-center">
                                    <div className="my-auto">
                                        <div className=" d-flex w-100 mb-4">
                                            <i className="fa-kit fa-regular-excavator-circle-user fa-5x text-primary-emphasis mx-auto"
                                               style={{fontSize: "7em"}}></i>
                                        </div>
                                        <h3 className="mb-3">
                                            Get started with JobFlowPro
                                        </h3>
                                        <div className="text-body-secondary mb-3">
                                            The easiest way to get manage your jobs as a contractor. Track your
                                            jobs, keep your client's up
                                            to date
                                            and make sure nothing gets lost.
                                        </div>
                                    </div>
                                </div>

                            </div>


                        </Form>;
                    }}
                </Formik>
            </div>

        </div>
    </>;
}