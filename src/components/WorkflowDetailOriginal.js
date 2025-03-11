import React from "react";
import './WorkflowDetail.css'

const WorkflowDetailOriginal = () => {

   const stepListItems = [];

   for (let step of workflowViewData) {

      const status = getBulletIconStyleForStep(step)

      stepListItems.push(
         <li className={status} key={step.id}>
            <div className="p-1" id={step.id}>
               {step.id}
            </div>
         </li>
      );
   }

   return (
      <ul className="bull">{stepListItems}</ul>
   );
}

const getBulletIconStyleForStep = (step) => {

   let status;

   if (!step.started) {
      status = 'not_started';
   } else if (step.completed) {
      status = 'completed';
   } else {
      status = 'started';
   }

   return status;
}

const getInnerContent = (step) => {

   let content;

   if (step.formProperties) {
      let inputsHtml = [];
      for (let formProperty in step.formProperties) {
         inputsHtml.push(
            <div className="form-floating mb-3">
               <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
               <label htmlFor="floatingInput">{formProperty.name}</label>
            </div>
         )
      }
      content = inputsHtml;
   } else {
      content = <span>{step.id}</span>
   }

   return content;
}

const renderForm = (step) => {

   const formPropertyDivs = [];

   for (let formProperty of step.formProperties) {
      formPropertyDivs.push(
         <div className="form-floating mb-3">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
            <label htmlFor="floatingInput">Email address</label>
         </div>
      );
   }

   return (
      // TODO: build a form from bootstrap 5 form utilities
      <></>
   );
}

const workflowViewData = [
   {
      "id": "sendViolationNotice",
      "started": 1699148440878,
      "completed": 1699148440890
   },
   {
      "id": "firstResolutionPeriod",
      "started": 1699148440894,
      "formProperties": [
         {
            "id": "resolutionDescription",
            "name": "Resolution Description",   // TODO: get this from resource bundle for user's locale
            "readable": true,
            "writable": true,
            "required": false
         },
         {
            "id": "resolvedBy",
            "name": "Resolved By",
            "readable": true,
            "writable": true,
            "required": false
         }
      ]
   },
   {
      "id": "secondResolutionPeriod"
   },
   {
      "id": "endedEvicted"
   }
]

export default WorkflowDetailOriginal