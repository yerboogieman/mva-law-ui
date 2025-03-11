import React, {useContext, useEffect, useRef, useState} from "react";
import {Field, FieldArray, Form, Formik} from "formik";
import {Collapse} from "react-bootstrap";
import {useSelector} from "react-redux";
import {LanguageContext} from "../../../contexts/LanguageContext";

import Toast from "../../../components/Toast/Toast";
import * as Yup from "yup";
import api from "../../../utilities/api.js";
import jb_utils from "../../../utilities/functions.jsx";

import strings from "./i18n-strings";

export default function ClientReviewsEstimate({jobId = "", setSelectedStep}) {

   const user_roles = useSelector(state => state.currentUserHolder.roles);

   const is_client = user_roles.some(role => role === "ROLE_CLIENT");

   const formikRef = useRef();

   const language = useContext(LanguageContext);
   strings.setLanguage(language || jb_utils.get_device_language());

   const [panelData, setPanelData] = useState({});
   const [disapprovedJobItems, setDisapprovedJobItems] = useState([]);

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
         const i = Object.assign({rejectionReason: "", approved: true}, pd);
         initPanelData.items.push(i);
      });
   } else {
      initPanelData.items.push([
         {
            name: "",
            description: "",
            estimatedCost: "0.0",
            rejectionReason: "",
            approved: true
         }
      ]);
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

   function submit_workflow_step(values) {
      api.update_whole_job(values)
         .then(job_result => {

            if (job_result.success === true) {


               const task_definition_key = "clientReviewsEstimate";
               const workflow_business_key = panelData.id;
               const redoEstimate = values.items.some(item => item.approved !== true);

               api.complete_workflow_step({
                  workflow_business_key,
                  task_definition_key,
                  variables: {
                     redoEstimate
                  }
               })
                  .then(workflow_result => {

                     if (redoEstimate) {
                        setSelectedStep("redoEstimate");
                     } else {
                        setSelectedStep("clientReviewsEstimate");
                     }

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
      <div className="mt-4 pb-5">
         <h3 className="mb-3">
            <i className="fad fa-person-circle-plus text-secondary me-3"
               style={{transform: "translateX(2px)"}}></i>
            {strings.title}
         </h3>

         {
            !is_client && <>
               <div className="bg-warning-subtle p-3 border rounded mb-3">
                  Pending client approval
               </div>
            </>
         }

         <div className="mb-3">
            <Formik
               enableReinitialize={true}
               initialValues={initPanelData}
               onSubmit={submit_workflow_step}
               validationSchema={Yup.object({
                  name: Yup.string().required(
                     strings.formatString(`${strings.job} ${strings.name}`,
                        strings.yup.is_required)),
                  description: Yup.string().notRequired()
               })}
               validateOnBlur={true}
               validateOnChange={true}
               innerRef={formikRef}>
               {({values, setFieldValue}) => {

                  return <Form autoComplete="false">
                     <Field type="hidden" name="id"></Field>

                     <div className="mb-3">
                        <label htmlFor="name" className="form-label tc">{strings.job} {strings.name}</label>
                        <Field type="text" name="name" id="name" className="form-control" disabled={true}/>
                     </div>
                     <div className="mb-3">
                        <label htmlFor="description"
                               className="form-label tc">{strings.job} {strings.description}</label>
                        <Field type="text" name="description" id="description"
                               className="form-control" disabled={true}/>
                     </div>

                     <div>
                        <h4>{strings.job + " " + strings.item + "s"}</h4>

                        <FieldArray name="items">
                           {
                              function ({}) {
                                 return <div className="mb-3">
                                    {values.items.length > 0 &&
                                       values.items.map(function (item, index) {

                                          const approved = item.approved === true;
                                          // const disapproved = disapprovedJobItems.some(
                                          //     e => e === item.id);
                                          return <div className="border border-1 rounded p-3 mb-3"
                                                      key={index + "job-item"}>
                                             <div className="row" key={index + "-step"}>
                                                <div className="col">
                                                   <div className="row">
                                                      <div className="col mb-2">
                                                         <label htmlFor={`items.${index}.name`}>
                                                            {`${strings.item} ${strings.name}`}
                                                         </label>
                                                         <Field className="form-control"
                                                                name={`items.${index}.name`}
                                                                placeholder="" type="text"
                                                                disabled={true}
                                                         />
                                                      </div>
                                                      <div className="col-4 mb-2">
                                                         <label
                                                            htmlFor={`items.${index}.estimatedCost`}>
                                                            {`${strings.estimate}`}
                                                         </label>
                                                         <Field className="form-control"
                                                                name={`items.${index}.estimatedCost`}
                                                                placeholder="$" type="text"
                                                                disabled={true}/>
                                                      </div>
                                                   </div>
                                                   <label
                                                      htmlFor={`items.${index}.description`}>
                                                      {strings.description}
                                                   </label>
                                                   <Field as="textarea" className="form-control mb-3"
                                                          name={`items.${index}.description`}
                                                          type="text" disabled={true}
                                                   />

                                                   {
                                                      <>
                                                         <Collapse in={!approved}>
                                                            <div className="">
                                                               <Field type="hidden" value={approved}
                                                                      name={`items.${index}.approved`}/>
                                                               <label className="form-label mb-2"
                                                                      htmlFor={`items.${index}.rejectionReason`}>
                                                                  {strings.disapprove_label}
                                                               </label>
                                                               <Field as="textarea"
                                                                      className="form-control mb-3"
                                                                      name={`items.${index}.rejectionReason`}
                                                                      id={`items.${index}.rejectionReason`}
                                                                      disabled={!is_client}
                                                                      data-item_id={item.id}/>
                                                               <div
                                                                  className="form-text">{strings.disapproval_description}</div>
                                                            </div>
                                                         </Collapse>
                                                         {
                                                            is_client
                                                               ? !approved
                                                                  ? <button
                                                                     type="button"
                                                                     className="btn btn-warning mt-3"
                                                                     onClick={() => {
                                                                        setFieldValue(`items.${index}.approved`, true);
                                                                     }}>
                                                                     Cancel
                                                                  </button>
                                                                  : <button
                                                                     type="button"
                                                                     className="btn btn-warning"
                                                                     onClick={(event) => {
                                                                        setFieldValue(`items.${index}.approved`, false);
                                                                     }}>
                                                                     Disapprove job item
                                                                  </button>
                                                               : <></>
                                                         }</>
                                                   }
                                                </div>
                                             </div>
                                          </div>;
                                       })}
                                 </div>;
                              }
                           }
                        </FieldArray>
                     </div>
                     {
                        is_client && <button type="submit" className="btn btn-primary">
                           {
                              "Submit estimate to contractor"
                           }
                        </button>
                     }
                  </Form>;
               }}
            </Formik>
         </div>


      </div>
   </>;
}