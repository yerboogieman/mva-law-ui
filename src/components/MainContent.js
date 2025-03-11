import React from "react";
import SideNav from "./SideNav/SideNav.jsx";
import WorkflowDetail from "./WorkflowDetail";
import workflowStepHandlers from "./WorkflowStepHandlers";

const processDefinitionKey = 'contractorJobProcess'
const stepId = 'clientReviewsEstimate'

const MainContent = () => {

   const processStepHandlers = workflowStepHandlers[processDefinitionKey]
   const StepHandler = processStepHandlers[stepId]

   return (
      <div className="container-fluid">
         <div className="row">
            <SideNav/>
            <div className="row col-9">
               <div className="col-sm-4 p-2">
                  <div className="card">
                     <div className="card-body">
                        <WorkflowDetail jobId={"23"}/>
                     </div>
                  </div>
               </div>
               <div className="col-sm-8 p-2">
                  <div className="card">
                     <div className="card-body">
                        <StepHandler/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default MainContent