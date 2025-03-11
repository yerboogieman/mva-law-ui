import React, {useContext, useEffect, useRef, useState} from "react";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Loading from "react-loading";
import {useDispatch} from "react-redux";
import {LanguageContext} from "../../../contexts/LanguageContext";
import {Link, useNavigate} from "react-router-dom";
import Toast from "../../../components/Toast/Toast";
import * as Yup from "yup";
import api from "../../../utilities/api.js";
import jb_utils from "../../../utilities/functions.jsx";

import strings from "./i18n-strings";

export default function RedoEstimate({
    jobId = ""
}) {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || jb_utils.get_device_language());

    const [panelData, setPanelData] = useState({});
    const [completingStep, setCompletingStep] = useState(false);

    const formikRef = useRef();

    const [toastConfig, setToastConfig] = useState({
        show: false,
        header_text: "",
        body_text: "",
        fade_out: false
    });

    const initPanelData = {
        "id": panelData.id || "",
        "name": panelData.name || "",
        "description": panelData.description || "",
        "cost": panelData.cost || "0.0",
        "amountPaid": panelData.amountPaid || "0.0",
        "contractorId": panelData.contractorId || "",
        "processInstanceId": panelData.processInstanceId || "",
        "items": []
    };

    if (Array.isArray(panelData.items) && panelData.items.length > 0) {

        panelData.items.forEach(function (pd) {
            initPanelData.items.push(pd);
        });
    } else {
        initPanelData.items.push(
            {
                name: "",
                description: "",
                estimatedCost: "0.0",
                rejectionReason: "",
                approved: null
            }
        );
    }

    useEffect(() => {

        if (typeof jobId === "string" && jobId.length > 0) {

            api.get_job(jobId)
                .then(result => {
                    if (result.success === true) {
                        setPanelData(result);
                    }
                });
        }
    }, [jobId]);

    function submit_to_client() {

        setCompletingStep(true);

        const form_values = formikRef.current.values;

        save_estimate(form_values, false)
            .then(result => {

                if (result.success === true) {
                    const task_definition_key = "redoEstimate";
                    const workflow_business_key = panelData.id;
                    api.complete_workflow_step({
                        workflow_business_key,
                        task_definition_key
                    }).then(r => {

                        if (r.success === true) {

                            setToastConfig({
                                show: true,
                                header_text: "Success",
                                body_text: "Estimate submitted to client for approval.",
                                fadeOut: true
                            });

                        } else {
                            setCompletingStep(false);
                        }
                    });
                } else {
                    setToastConfig({
                        show: true,
                        header_text: "Error",
                        body_text: "Draft could not be saved. Please try again or contact support.",
                        fadeOut: false,
                        variant: "warning"
                    });

                    setCompletingStep(false);
                }
            });
    }

    function save_estimate(values, show_toast = true) {

        // first make sure all job items have a name
        const items = values.items;

        if (items.length > 0) {
            values.items = items.filter(item => item.name.length > 0);
        }

        return api.update_whole_job(values)
            .then(r => {
                if (r.success === true) {
                    if (show_toast) {
                        setToastConfig({
                            show: true,
                            header_text: "Success",
                            body_text: "Draft saved",
                            fadeOut: true
                        });
                    }
                } else {
                    setToastConfig({
                        show: true,
                        header_text: "Error",
                        body_text: "Draft could not be saved. Please try again or contact support.",
                        fadeOut: true,
                        variant: "warning"
                    });
                }

                return r;
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
        <div className="mt-4 pb-5">
            <h3 className="mb-3">
                <i className="fad fa-person-circle-plus text-secondary me-3"
                   style={{transform: "translateX(2px)"}}></i>
                {strings.title}
            </h3>
            <div className="mb-3">
                <Formik
                    enableReinitialize={true}
                    initialValues={initPanelData}
                    onSubmit={save_estimate}
                    validationSchema={Yup.object({
                        name: Yup.string().required(
                            strings.formatString(`${strings.job} ${strings.name}`,
                                strings.yup.is_required)),
                        description: Yup.string().notRequired()
                    })}
                    innerRef={formikRef}
                    validateOnBlur={true}
                    validateOnChange={true}>
                    {({values}) => {

                        return <Form autoComplete="false">
                            <Field type="hidden" name="id"/>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label tc">{strings.job} {strings.name}</label>
                                <Field type="text" name="name" id="name" className="form-control"/>
                                <ErrorMessage name="name" component="div" className="text-danger"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description"
                                       className="form-label tc">{strings.job} {strings.description}</label>
                                <Field type="text" name="description" id="description" className="form-control"/>
                                <ErrorMessage name="description" component="div" className="text-danger"/>
                            </div>

                            <div>
                                <h4>{strings.job + " " + strings.item + "s"}</h4>

                                <FieldArray name="items">
                                    {
                                        function (fieldArrayRenderProps) {
                                            return JobItem(fieldArrayRenderProps, values);
                                        }
                                    }
                                </FieldArray>
                            </div>

                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary sc">
                                    <i className="fa-duotone fa-floppy-disk me-2"></i>
                                    Save estimate draft
                                </button>
                            </div>
                        </Form>;
                    }}
                </Formik>
            </div>

            <hr/>

            {
                completingStep
                    ? <>
                        <button type="button" className="btn btn-primary" disabled={true}>
                            <Loading type="cubes"/>Resubmit to client for approval
                        </button>
                    </>
                    : <button type="button" className="btn btn-primary" onClick={submit_to_client}>
                        Resubmit to client for approval
                    </button>
            }
        </div>
    </>;

    function JobItem({
        insert,
        remove,
        push
    }, values) {
        return <div className="mb-3">
            {values.items.length > 0 &&
                values.items.map(function (item, index) {

                    let approval_class = "";
                    if (item.approved === true) {
                        approval_class = " border-success";
                    } else if (item.approved === false) {
                        approval_class = " border-danger";
                    }

                    return <div className={"border border-1 rounded p-3 mb-3" + approval_class}
                                key={index + "job-item"}>
                        <div className="row" key={index + "-step"}>
                            <div className="col mb-3">
                                <div className="row">
                                    <div className="col mb-2">
                                        <label htmlFor={`items.${index}.name`}>
                                            {`${strings.item} ${strings.name}`}
                                        </label>
                                        <Field className="form-control"
                                               name={`items.${index}.name`}
                                               placeholder="" type="text"
                                        />
                                        <ErrorMessage
                                            name={`items.${index}.name`}
                                            component="div"
                                            className="field-error"
                                        />
                                    </div>
                                    <div className="col-4 mb-2">
                                        <label
                                            htmlFor={`items.${index}.estimatedCost`}>
                                            {`${strings.estimate}`}
                                        </label>
                                        <Field className="form-control"
                                               name={`items.${index}.estimatedCost`}
                                               placeholder="$" type="text"/>
                                        <ErrorMessage
                                            name={`items.${index}.estimatedCost`}
                                            component="div" className="field-error"
                                        />
                                    </div>
                                </div>
                                <label
                                    htmlFor={`items.${index}.description`}>
                                    {strings.description}
                                </label>
                                <Field as="textarea" className="form-control"
                                       name={`items.${index}.description`} type="text"/>
                                <ErrorMessage
                                    name={`items.${index}.description`}
                                    component="div" className="field-error"
                                />
                            </div>
                            {/*Delete button*/}
                            <div className="col-auto">

                                {index === 0
                                    ? <OverlayTrigger
                                        placement={"bottom"}
                                        overlay={
                                            <Tooltip
                                                id={`tooltip-${index}-job-item`}>
                                                All jobs must
                                                have at
                                                least one thing to do.
                                            </Tooltip>
                                        }>
                                        <div>
                                            <button type="button"
                                                    className="btn btn-sm btn-warning disabled"
                                                    onClick={() => remove(index)}>
                                                <i className="fa-duotone fa-xmark"></i>
                                            </button>
                                        </div>
                                    </OverlayTrigger>
                                    : <button type="button"
                                              className="btn btn-sm btn-warning"
                                              onClick={() => remove(index)}>
                                        <i className="fa-duotone fa-xmark"></i>
                                    </button>
                                }
                            </div>

                            {/*    Save item button*/}
                            <div className="d-none">
                                <button className="btn btn-dark">Save item</button>
                            </div>

                        </div>
                    </div>;
                })}
            <button
                type="button"
                className="btn btn-success"
                onClick={() => push({
                    name: "",
                    description: "",
                    cost: 0,
                    rejectionReason: ""
                })}>
                <i className="fa-duotone fa-circle-plus me-2"></i>Add Job Item
            </button>
        </div>;
    }
}