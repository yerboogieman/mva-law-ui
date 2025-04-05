import React, {useEffect, useState} from "react";
import './WorkflowDetail.css'

export default function WorkflowDetail({caseId}) {

   // const [loading, setLoading] = useState(true)
   // const [workflowData, setWorkflowData] = useState([]);
   //
   // useEffect(() => {
   //    fetch(`http://localhost:8080/cases/${caseId}`)
   //       .then((res) => res.json())
   //       .then(value => {
   //          if (value.success === true) {
   //             setWorkflowData(value.data)
   //          } else {
   //             // TODO: Handle failure
   //          }
   //          setLoading(false)
   //       })
   // }, []);

   const stepListItems = [];

   let i = 0;
   for (let step of workflowViewData) {

      ++i;

      const hasSubSteps = Object.hasOwn(step, 'steps')
      const stepStatus = getBulletIconStyleForStep(step)
      const stepIconInfo = getBulletIconNameForStep(step)
      const stepIconClass = stepIconInfo['class']
      const stepIconColor = stepIconInfo['color']
      const stepIconName = stepIconInfo['name']
      const isCurrent = stepStatus === 'started'
      const accordionButtonClass = `accordion-button ${isCurrent ? '' : 'collapsed'}`

      if (hasSubSteps) {

         const subStepListItems = [];

         for (let subStep of step.steps) {

            const subStepIconInfo = getBulletIconNameForStep(subStep)
            const subStepIconClass = subStepIconInfo['class']
            const subStepIconColor = subStepIconInfo['color']
            const subStepIconName = subStepIconInfo['name']

            subStepListItems.push(
               <li className="list-group-item">
                  <i className={`${subStepIconClass} pe-2`} style={{fontSize: '16px', fontWeight: 'bold', color: subStepIconColor}}>{subStepIconName}</i>
                  {subStep.label}
               </li>
            )
         }

         // TODO: hide disabled panel arrow icons
         // https://forum.bootstrapstudio.io/t/removing-up-down-default-arrows-on-accordion-items/8815/2

         const accordionButtonClass = `accordion-button ${stepStatus === 'not_started' ? 'accordion-button-disabled' : ''} ${isCurrent ? '' : 'collapsed'}`

         stepListItems.push(
            <div className="accordion-item">
               <h2 className="accordion-header" id={`heading${i}`}>
                  <button className={accordionButtonClass} type="button" data-bs-toggle="collapse"
                          data-bs-target={`#collapse${i}`} aria-expanded={isCurrent} aria-controls={`collapse${i}`}>
                     <i className={stepIconClass} style={{fontSize: "18px", fontWeight: 'bold', color: stepIconColor}}>{stepIconName}</i>
                     <span className="ps-2">{step.label}</span>
                  </button>
               </h2>
               <div id={`collapse${i}`} className={`accordion-collapse collapse ${isCurrent ? 'show' : ''}`} aria-labelledby={`heading${i}`} data-bs-parent="#workflowAccordion">
                  <div className="accordion-body">
                     <ul className="list-group list-group-flush">
                        {subStepListItems}
                     </ul>
                  </div>
               </div>
            </div>
         )
      }
   }

   return (
      <div className="accordion" id="workflowAccordion">{stepListItems}</div>
   );
}

const iconNamesByStatus = {
   'completed': { name: 'check_circle', color: '#2282D6', class: 'material-icons' },
   'not_started': { name: 'circle', color: 'grey', class: 'material-icons-outlined' },
   'started': { name: 'circle', color: '#2282D6', class: 'material-icons-outlined' }
}

const getBulletIconNameForStep = (step) => {
   const status = getBulletIconStyleForStep(step)
   return iconNamesByStatus[status]
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
      "id": "estimate",
      "label": "Estimate",
      "started": 1702534214909,
      "steps": [
         {
            "id": "createEstimate",
            "label": "Create estimate",
            "started": 1702534214909,
            "completed": 1702534214911
         },
         {
            "id": "clientReviewsEstimate",
            "label": "Client reviews estimate",
            "started": 1702534214918,
            "formProperties": [
               {
                  "id": "isRedoEstimate",
                  "name": "Redo estimate",
                  "readable": true,
                  "writable": true,
                  "required": false
               },
               {
                  "id": "isProceed",
                  "name": "Proceed with case?",
                  "readable": true,
                  "writable": true,
                  "required": false
               }
            ]
         },
         {
            "id": "redoEstimate",
            "label": "Redo estimate"
         }
      ]
   },
   {
      "id": "prePayment",
      "label": "Pre-payment",
      "steps": [
         {
            "id": "prePaymentServiceTask",
            "label": "Pre-payment service task"
         }
      ]
   },
   {
      "id": "case",
      "label": "Case",
      "steps": [
         {
            "id": "completeCaseItems",
            "label": "Complete case items"
         },
         {
            "id": "clientCaseApproval",
            "label": "Client case approval"
         }
      ]
   },
   {
      "id": "finalPayment",
      "label": "Final payment",
      "steps": [
         {
            "id": "finalPaymentServiceTask",
            "label": "Final payment service task"
         }
      ]
   }
]
